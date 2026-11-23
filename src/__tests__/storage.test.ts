import { describe, expect, it } from 'vitest'
import { sanitizeCartLines } from '../lib/storage'
import { products } from '../data/products'

describe('sanitizeCartLines', () => {
  it('descarta basura', () => {
    expect(sanitizeCartLines(null)).toEqual([])
    expect(sanitizeCartLines('x')).toEqual([])
    expect(sanitizeCartLines([{ productId: 1, qty: 2 }])).toEqual([])
    expect(sanitizeCartLines([{ productId: 'nope', qty: 2 }])).toEqual([])
  })

  it('clampa qty y deduplica', () => {
    const product = products.find((p) => p.stockPolicy === 'backorder')!
    const id = product.id
    const out = sanitizeCartLines([
      { productId: id, qty: 999 },
      { productId: id, qty: 2 },
      { productId: id, qty: 0 },
    ])
    expect(out).toEqual([{ productId: id, qty: 99 }])
  })

  it('descarta variantes inválidas', () => {
    const product = products.find((p) => p.variants?.length)!
    const out = sanitizeCartLines([{ productId: product.id, variantId: 'nope', qty: 1 }])
    expect(out).toEqual([])
  })
})


