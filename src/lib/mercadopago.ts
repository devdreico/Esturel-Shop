import type { Product } from '../data/types'

/**
 * Links de pago únicos de Mercado Pago por producto (Checkout por link).
 * En producción: crear cada link en Mercado Pago → Links de pago.
 */
export function openProductPayment(product: Product): void {
  window.open(product.mpPaymentLink, '_blank', 'noopener,noreferrer')
}

export function openProductPaymentInPlace(product: Product): void {
  window.location.href = product.mpPaymentLink
}

/**
 * Multi-línea: los links de pago de MP son por producto (precio fijo).
 * Abrimos cada link en pestaña (limitación documentada del MVP sin Preference API).
 */
export function openCartPayments(lines: { product: Product; qty: number }[]): void {
  lines.forEach((line, i) => {
    window.setTimeout(() => {
      window.open(line.product.mpPaymentLink, '_blank', 'noopener,noreferrer')
    }, i * 350)
  })
}

export function paymentNoteForQty(qty: number): string {
  if (qty > 1) {
    return `Nota: el link de pago de MP es unitario. Si llevas ${qty}, confirma la cantidad en el resumen de Mercado Pago o contacta a Esturel.`
  }
  return 'Serás redirigido a Mercado Pago (tarjeta, PSE, Nequi, Efecty…).'
}
