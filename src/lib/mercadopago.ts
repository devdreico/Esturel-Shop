import type { Product } from '../data/types'
import { isDemoPaymentLink } from './mpValidate'

/**
 * Links de pago únicos de Mercado Pago por producto.
 * En producción: crear cada link en Mercado Pago → Links de pago.
 */
export function openProductPayment(product: Product): void {
  if (isDemoPaymentLink(product.mpPaymentLink)) {
    console.warn('[Esturel] Link de pago MP demo — configura mpPaymentLink real', product.slug)
  }
  window.open(product.mpPaymentLink, '_blank', 'noopener,noreferrer')
}

/**
 * Multi-línea: los links de pago de MP son por producto (precio fijo).
 * Se usa un solo popup del gesto del usuario y se encola con blob:console
 * solo cuando hay 1; multi se resuelve con botones por línea (evita popup blockers).
 */
export function openCartPayments(lines: { product: Product; qty: number }[]): void {
  const first = lines[0]
  if (!first) return
  openProductPayment(first.product)
}

export function paymentNoteForQty(qty: number): string {
  if (qty > 1) {
    return `Nota: el link de pago de MP es unitario. Si llevas ${qty}, confirma la cantidad o contacta a Esturel.`
  }
  return 'Serás redirigido a Mercado Pago (tarjeta, PSE, Nequi, Efecty…).'
}
