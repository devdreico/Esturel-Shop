import { site } from '../config/site'
import type { ShippingQuote } from '../data/types'

export function quoteShipping(subtotal: number): ShippingQuote {
  const { flatRateCOP, freeFromCOP } = site.shipping
  const freeShipping = subtotal >= freeFromCOP
  const shipping = freeShipping ? 0 : flatRateCOP
  const remainingForFree = freeShipping ? 0 : Math.max(0, freeFromCOP - subtotal)
  return {
    subtotal,
    shipping,
    total: subtotal + shipping,
    freeShipping,
    remainingForFree,
  }
}

export function shippingLabel(shipping: number): string {
  return shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString('es-CO')}`
}
