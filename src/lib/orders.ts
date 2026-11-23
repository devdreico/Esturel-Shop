import { site, supabaseConfigured } from '../config/site'
import { STORAGE_KEYS, readJSON, writeJSON, removeKey } from './storage'
import { submitOrder } from './formspree'
import { quoteShipping } from './shipping'
import { getProductById } from '../data/products'
import { waUrl, orderWhatsAppMessage } from './whatsapp'
import { formatCOP } from './format'
import type { CreatedOrder, CustomerAddress, OrderItemInput } from '../data/types'

export type OrderDraft = {
  customer: CustomerAddress
  items: OrderItemInput[]
  notes?: string
  consent: boolean
  idempotencyKey?: string
}

export type OrderValidationErrors = Partial<Record<
  | 'nombre'
  | 'celular'
  | 'direccion'
  | 'ciudad'
  | 'departamento'
  | 'items'
  | 'consent'
  | 'notas',
  string
>>

export function validateOrder(draft: OrderDraft): OrderValidationErrors {
  const e: OrderValidationErrors = {}
  if (!draft.customer.nombre || draft.customer.nombre.trim().length < 2) {
    e.nombre = 'Escribe tu nombre completo.'
  }
  if (!/^\d{10}$/.test(draft.customer.celular.replace(/\D/g, '').replace(/^57/, ''))) {
    e.celular = 'Celular inválido. Usa 10 dígitos (ej. 300 123 4567).'
  }
  if (draft.customer.direccion.trim().length < 5) {
    e.direccion = 'Dirección demasiado corta.'
  }
  if (draft.customer.ciudad.trim().length < 2) e.ciudad = 'Selecciona o escribe tu ciudad.'
  if (draft.customer.departamento.trim().length < 2) e.departamento = 'Selecciona tu departamento.'
  if (!draft.items.length) e.items = 'Tu carrito está vacío.'
  if (!draft.consent) e.consent = 'Debes autorizar el tratamiento de datos.'
  return e
}

function summarizeItems(draft: OrderDraft) {
  const lines: { name: string; qty: number; lineTotal: number }[] = []
  let subtotal = 0
  for (const item of draft.items) {
    const product = getProductById(item.productId)
    if (!product) continue
    const variant = product.variants?.find((v) => v.id === item.variantId)
    const price = variant?.priceCOP ?? product.priceCOP
    const qty = Math.min(Math.max(1, Math.floor(item.qty)), 99)
    const lineTotal = price * qty
    subtotal += lineTotal
    const label = variant ? `${product.name} — ${variant.label}` : product.name
    lines.push({ name: label, qty, lineTotal })
  }
  return { lines, subtotal }
}

function newOrderCode(): string {
  const now = new Date()
  const ym = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`
  const rand = Math.floor(10000 + Math.random() * 90000)
  return `EST-${ym}-${rand}`
}

function makeIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

export function getIdempotencyKey(): string {
  const existing = sessionStorage.getItem('esturel-idempotency')
  if (existing) return existing
  const key = makeIdempotencyKey()
  sessionStorage.setItem('esturel-idempotency', key)
  return key
}

export function clearIdempotencyKey(): void {
  sessionStorage.removeItem('esturel-idempotency')
}

export async function createOrder(draft: OrderDraft): Promise<CreatedOrder> {
  const errors = validateOrder(draft)
  if (Object.keys(errors).length) {
    const first = Object.values(errors)[0] ?? 'Revisa los datos del pedido.'
    throw new Error(first)
  }

  const { lines, subtotal } = summarizeItems(draft)
  const shipping = quoteShipping(subtotal).shipping
  const total = subtotal + shipping
  const code = newOrderCode()
  const idempotencyKey = draft.idempotencyKey ?? getIdempotencyKey()
  const createdAt = new Date().toISOString()

  // 1. Supabase (fuente de verdad)
  if (supabaseConfigured) {
    const url = site.integrations.supabaseUrl.replace(/\/+$/, '')
    const anon = site.integrations.supabaseAnonKey
    const payload = {
      p_order: {
        idempotency_key: idempotencyKey,
        customer: {
          nombre: draft.customer.nombre.trim(),
          celular: draft.customer.celular.replace(/\D/g, ''),
          correo: draft.customer.correo.trim(),
          departamento: draft.customer.departamento.trim(),
          ciudad: draft.customer.ciudad.trim(),
          direccion: draft.customer.direccion.trim(),
          notas: draft.customer.notas.trim(),
        },
        items: draft.items.map((i) => ({
          product_id: i.productId,
          variant_id: i.variantId ?? null,
          qty: Math.max(1, Math.floor(i.qty)),
        })),
        notes: draft.customer.notas.trim(),
        consent: draft.consent,
      },
    }

    const res = await fetch(`${url}/rest/v1/rpc/create_order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: anon,
        Authorization: `Bearer ${anon}`,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      let detail = ''
      try {
        const data = (await res.json()) as { message?: string; error?: string; details?: string }
        detail = data.message || data.error || data.details || ''
      } catch {
        detail = await res.text().catch(() => '')
      }
      throw new Error(detail || `No pudimos guardar el pedido (${res.status}).`)
    }

    const raw = (await res.json()) as
      | { code?: string; order_code?: string; subtotal?: number; shipping?: number; total?: number; status?: string; created_at?: string }
      | { code?: string; order_code?: string; subtotal?: number; shipping?: number; total?: number; status?: string; created_at?: string }[]
    const data = Array.isArray(raw) ? raw[0] ?? {} : raw

    const created: CreatedOrder = {
      code: data.code ?? data.order_code ?? code,
      status: (data.status as CreatedOrder['status']) ?? 'pendiente',
      subtotal: typeof data.subtotal === 'number' ? data.subtotal : subtotal,
      shipping: typeof data.shipping === 'number' ? data.shipping : shipping,
      total: typeof data.total === 'number' ? data.total : total,
      createdAt: data.created_at ?? createdAt,
      persisted: true,
    }
    writeLastOrder(created, draft, lines)
    clearIdempotencyKey()
    return created
  }

  // 2. Formspree (notificación, sin persistencia real)
  if (site.integrations.formspreeEndpoint) {
    const resumen = lines.map((l) => `${l.qty} × ${l.name} — ${formatCOP(l.lineTotal)}`).join('\n')
    await submitOrder({
      nombre: draft.customer.nombre,
      celular: draft.customer.celular,
      correo: draft.customer.correo,
      direccion: draft.customer.direccion,
      ciudad: draft.customer.ciudad,
      departamento: draft.customer.departamento,
      notas: draft.customer.notas,
      resumen,
      totalProductos: subtotal,
      envio: 'Gratis',
      tiempoEntrega: site.shipping.estimate,
      idempotencyKey,
    })

    const created: CreatedOrder = {
      code,
      status: 'pendiente',
      subtotal,
      shipping,
      total,
      createdAt,
      persisted: false,
    }
    writeLastOrder(created, draft, lines)
    clearIdempotencyKey()
    return created
  }

  throw new Error('No hay un sistema de pedidos configurado. Escríbenos por WhatsApp.')
}

export type StoredOrder = {
  order: CreatedOrder
  customer: CustomerAddress
  lines: { name: string; qty: number; lineTotal: number }[]
  whatsappUrl: string
}

export function writeLastOrder(
  order: CreatedOrder,
  draft: OrderDraft,
  lines: { name: string; qty: number; lineTotal: number }[],
): void {
  const shipping = order.shipping
  const stored: StoredOrder = {
    order,
    customer: draft.customer,
    lines,
    whatsappUrl: waUrl(
      orderWhatsAppMessage({
        nombre: draft.customer.nombre,
        celular: draft.customer.celular,
        direccion: draft.customer.direccion,
        ciudad: draft.customer.ciudad,
        departamento: draft.customer.departamento,
        notas: draft.customer.notas || undefined,
        lines,
        productsTotal: order.subtotal,
        shipping,
        orderCode: order.code,
      }),
    ),
  }
  writeJSON(STORAGE_KEYS.lastOrder, stored)
}

export function readLastOrder(): StoredOrder | null {
  const raw = readJSON<unknown>(STORAGE_KEYS.lastOrder, null)
  if (!raw || typeof raw !== 'object') return null
  const o = raw as StoredOrder
  if (!o.order?.code || !Array.isArray(o.lines)) return null
  return o
}

export function clearLastOrder(): void {
  removeKey(STORAGE_KEYS.lastOrder)
}

export function lastOrderWhatsAppUrl(): string | null {
  return readLastOrder()?.whatsappUrl ?? null
}
