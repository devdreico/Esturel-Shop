import { describe, expect, it } from 'vitest'
import { filterProducts, getProductBySlug, products } from '../data/products'

describe('products catalog', () => {
  it('tiene productos únicos con slug', () => {
    const slugs = products.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    expect(products.length).toBeGreaterThanOrEqual(8)
  })

  it('getProductBySlug encuentra producto', () => {
    const p = getProductBySlug('esturel-pulse-anc')
    expect(p?.name).toBe('Esturel Pulse ANC')
  })

  it('filtra por categoría', () => {
    const list = filterProducts({ category: 'audifonos' })
    expect(list.length).toBeGreaterThan(0)
    expect(list.every((p) => p.category === 'audifonos')).toBe(true)
  })

  it('busca por texto', () => {
    const list = filterProducts({ query: 'anc' })
    expect(list.some((p) => p.slug === 'esturel-pulse-anc')).toBe(true)
  })

  it('ordena por precio ascendente', () => {
    const list = filterProducts({ sort: 'price-asc' })
    for (let i = 1; i < list.length; i++) {
      expect(list[i]!.priceCOP).toBeGreaterThanOrEqual(list[i - 1]!.priceCOP)
    }
  })

  it('todos los precios son enteros COP > 0', () => {
    expect(products.every((p) => Number.isInteger(p.priceCOP) && p.priceCOP > 0)).toBe(true)
  })
})
