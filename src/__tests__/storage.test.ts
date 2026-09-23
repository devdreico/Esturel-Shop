import { describe, expect, it } from 'vitest'
import { sanitizeCartLines } from '../lib/storage'
import { isDemoPaymentLink } from '../lib/mpValidate'
import { safeHttpsUrl } from '../lib/rss'
import { products } from '../data/products'

describe('sanitizeCartLines', () => {
  it('descarta basura', () => {
    expect(sanitizeCartLines(null)).toEqual([])
    expect(sanitizeCartLines('x')).toEqual([])
    expect(sanitizeCartLines([{ productId: 1, qty: 2 }])).toEqual([])
    expect(sanitizeCartLines([{ productId: 'nope', qty: 2 }])).toEqual([])
  })

  it('clampa qty y deduplica', () => {
    const id = products[0]!.id
    const out = sanitizeCartLines([
      { productId: id, qty: 999 },
      { productId: id, qty: 2 },
      { productId: id, qty: 0 },
    ])
    expect(out).toEqual([{ productId: id, qty: 99 }])
  })
})

describe('safeHttpsUrl', () => {
  it('acepta https', () => {
    expect(safeHttpsUrl('https://example.com/a')).toBe('https://example.com/a')
  })
  it('rechaza javascript y http', () => {
    expect(safeHttpsUrl('javascript:alert(1)')).toBeNull()
    expect(safeHttpsUrl('http://example.com')).toBeNull()
    expect(safeHttpsUrl('not a url')).toBeNull()
  })
})

describe('isDemoPaymentLink', () => {
  it('marca placeholders demo', () => {
    expect(isDemoPaymentLink('https://www.mercadopago.com.co/pay/esturel-pulse-anc')).toBe(true)
    expect(isDemoPaymentLink('')).toBe(true)
    expect(isDemoPaymentLink('ftp://x')).toBe(true)
  })
})
