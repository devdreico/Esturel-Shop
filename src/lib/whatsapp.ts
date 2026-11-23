import { site } from '../config/site'
import { formatCOP } from './format'

export const WHATSAPP_NUMBER_E164 = site.contact.whatsappNumber
export const WHATSAPP_DISPLAY = site.contact.whatsappDisplay

export function waUrl(message?: string, number?: string): string {
  const num = (number ?? site.contact.whatsappNumber).replace(/\D/g, '')
  const base = `https://wa.me/${num}`
  if (!message) return base
  return `${base}?text=${encodeURIComponent(message)}`
}

export type OrderMessageLine = { name: string; qty: number; lineTotal: number }

export function orderWhatsAppMessage(input: {
  nombre: string
  celular: string
  direccion: string
  ciudad: string
  departamento: string
  notas?: string
  lines: OrderMessageLine[]
  productsTotal: number
  shipping: number
  orderCode?: string
  paymentNote?: string
}): string {
  const items = input.lines
    .map((l) => `• ${l.qty} × ${l.name} — ${formatCOP(l.lineTotal)}`)
    .join('\n')
  const parts = [
    'Hola Esturel, quiero registrar este pedido CONTRAENTREGA:',
    '',
    items,
    '',
    `Total productos: ${formatCOP(input.productsTotal)}`,
    `Envío: ${input.shipping === 0 ? 'Gratis' : formatCOP(input.shipping)}`,
    `Total a pagar: ${formatCOP(input.productsTotal + input.shipping)}`,
  ]
  if (input.orderCode) parts.push(`Código de pedido: ${input.orderCode}`)
  parts.push(
    '',
    `Nombre: ${input.nombre}`,
    `Celular: ${input.celular}`,
    `Dirección: ${input.direccion}`,
    `Ciudad: ${input.ciudad} (${input.departamento})`,
  )
  if (input.notas) parts.push(`Notas: ${input.notas}`)
  parts.push('', `Pago: ${input.paymentNote ?? 'contraentrega en efectivo al recibir'}.`)
  return parts.join('\n')
}
