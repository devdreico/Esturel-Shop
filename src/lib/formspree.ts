import { formatCOP } from './format'

/**
 * Formspree — recepción de pedidos contraentrega (no requiere backend).
 * Los pedidos llegan al correo asociado a la cuenta de Formspree.
 * NOTA: la primera submission requiere activar el formulario por correo.
 */
export const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xbglnlgb'

export type OrderPayload = {
  nombre: string
  celular: string
  correo: string
  direccion: string
  ciudad: string
  departamento: string
  notas: string
  resumen: string
  totalProductos: number
}

export async function submitOrder(payload: OrderPayload): Promise<void> {
  const res = await fetch(FORMSPREE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      nombre: payload.nombre,
      celular: payload.celular,
      correo: payload.correo || '(no informado)',
      direccion: payload.direccion,
      ciudad: payload.ciudad,
      departamento: payload.departamento,
      notas: payload.notas || '(sin notas)',
      pedido: payload.resumen,
      total_productos: formatCOP(payload.totalProductos),
      tipo_pago: 'Contraentrega',
    }),
  })
  if (!res.ok) {
    let detail = ''
    try {
      const data = (await res.json()) as { errors?: { message?: string }[] }
      detail = data.errors?.map((e) => e.message).filter(Boolean).join('; ') ?? ''
    } catch {
      /* cuerpo no JSON: ignorar */
    }
    throw new Error(detail || `Formspree respondió ${res.status}. Intenta de nuevo o escríbenos por WhatsApp.`)
  }
}
