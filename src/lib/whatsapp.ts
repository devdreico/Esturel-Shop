import { formatCOP } from './format'

/**
 * WhatsApp Esturel — canal de coordinación, soporte y pedidos.
 * Número en formato E.164 (Colombia): +57 314 457 2008.
 */
export const WHATSAPP_NUMBER_E164 = '573144572008'
export const WHATSAPP_DISPLAY = '+57 314 457 2008'

export function waUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER_E164}`
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
    'Envío: se cotiza',
    '',
    `Nombre: ${input.nombre}`,
    `Celular: ${input.celular}`,
    `Dirección: ${input.direccion}`,
    `Ciudad: ${input.ciudad} (${input.departamento})`,
  ]
  if (input.notas) parts.push(`Notas: ${input.notas}`)
  parts.push('', 'Pago: contraentrega en efectivo al recibir.')
  return parts.join('\n')
}
