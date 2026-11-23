import { describe, expect, it } from 'vitest'
import { quoteShipping } from '../lib/shipping'
import { site } from '../config/site'

describe('quoteShipping', () => {
  it('cobra tarifa plana bajo el umbral', () => {
    const q = quoteShipping(100000)
    expect(q.shipping).toBe(site.shipping.flatRateCOP)
    expect(q.freeShipping).toBe(false)
    expect(q.total).toBe(100000 + site.shipping.flatRateCOP)
  })

  it('envío gratis desde el umbral', () => {
    const q = quoteShipping(site.shipping.freeFromCOP)
    expect(q.shipping).toBe(0)
    expect(q.freeShipping).toBe(true)
  })

  it('calcula lo que falta para envío gratis', () => {
    const q = quoteShipping(100000)
    expect(q.remainingForFree).toBe(site.shipping.freeFromCOP - 100000)
  })
})
