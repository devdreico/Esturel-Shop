import rawProducts from '../../content/products.json'
import type {
  Product,
  ProductCategory,
  ProductVariant,
  StockStatus,
} from './types'

function normalizeVariant(variant: ProductVariant): ProductVariant {
  return {
    ...variant,
    stock: Math.max(0, Math.floor(Number(variant.stock) || 0)),
    ...(variant.priceCOP != null ? { priceCOP: Math.max(0, Math.floor(variant.priceCOP)) } : {}),
  }
}

function normalizeProduct(product: Product): Product {
  const images = (product.images?.length ? product.images : [product.image]).filter(Boolean)
  const variants = product.variants?.map(normalizeVariant)
  return {
    ...product,
    image: images[0] ?? '/products/placeholder.webp',
    images: images.length ? images : ['/products/placeholder.webp'],
    stock: Math.max(0, Math.floor(Number(product.stock) || 0)),
    warrantyMonths:
      Number.isFinite(product.warrantyMonths) && product.warrantyMonths >= 0
        ? Math.floor(product.warrantyMonths)
        : 6,
    ...(variants?.length ? { variants } : {}),
  }
}

export const products: Product[] = (rawProducts as unknown as Product[]).map(normalizeProduct)

const byId = new Map(products.map((p) => [p.id, p]))
const bySlug = new Map(products.map((p) => [p.slug, p]))

export function getProductById(id: string): Product | undefined {
  return byId.get(id)
}

export function getProductBySlug(slug: string): Product | undefined {
  return bySlug.get(slug)
}

export function getFeaturedProducts(limit = 8): Product[] {
  const featured = products.filter((p) => p.featured)
  return (featured.length ? featured : products).slice(0, limit)
}

export function getVariant(product: Product, variantId?: string): ProductVariant | undefined {
  if (!variantId) return undefined
  return product.variants?.find((v) => v.id === variantId)
}

export function getDefaultVariant(product: Product): ProductVariant | undefined {
  if (!product.variants?.length) return undefined
  return product.variants.find((v) => v.stock > 0) ?? product.variants[0]
}

export function variantStock(product: Product, variantId?: string): number {
  if (variantId) return getVariant(product, variantId)?.stock ?? 0
  if (product.variants?.length) {
    return product.variants.reduce((sum, v) => sum + Math.max(0, v.stock), 0)
  }
  return Math.max(0, product.stock)
}

export function stockStatus(product: Product, variantId?: string): StockStatus {
  if (variantStock(product, variantId) > 0) return 'disponible'
  return product.stockPolicy === 'backorder' ? 'pedido' : 'agotado'
}

export function unitPrice(product: Product, variantId?: string): number {
  return getVariant(product, variantId)?.priceCOP ?? product.priceCOP
}

export function maxQty(product: Product, variantId?: string): number {
  const stock = variantStock(product, variantId)
  if (stock > 0) return Math.min(stock, 99)
  return product.stockPolicy === 'backorder' ? 99 : 0
}

export function productImage(product: Product, variantId?: string): string {
  return getVariant(product, variantId)?.image ?? product.image
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  const sameCategory = products.filter(
    (p) => p.id !== product.id && p.category === product.category,
  )
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit)
  const tagOverlap = products
    .filter((p) => p.id !== product.id && p.category !== product.category)
    .map((p) => ({
      p,
      score: (p.tags ?? []).filter((t) => (product.tags ?? []).includes(t)).length,
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p)
  return [...sameCategory, ...tagOverlap].slice(0, limit)
}

export function categoryCounts(): Record<ProductCategory | 'all', number> {
  const counts = {
    all: products.length,
    audifonos: 0,
    perifericos: 0,
    frontier: 0,
    accesorios: 0,
    streaming: 0,
  } satisfies Record<ProductCategory | 'all', number>
  for (const p of products) counts[p.category] += 1
  return counts
}

export type ProductSort = 'relevance' | 'price-asc' | 'price-desc' | 'name' | 'newest'

export function filterProducts(opts: {
  category?: string
  query?: string
  sort?: ProductSort
  inStockOnly?: boolean
}): Product[] {
  let list = [...products]

  if (opts.category && opts.category !== 'all') {
    list = list.filter((p) => p.category === opts.category)
  }

  const q = (opts.query ?? '').trim().toLowerCase()
  if (q) {
    list = list.filter((p) => {
      const haystack = [
        p.name,
        p.brand,
        p.shortDesc,
        p.description,
        p.category,
        p.sku,
        ...(p.tags ?? []),
        ...p.specs.flatMap((s) => [s.label, s.value]),
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(q)
    })
  }

  if (opts.inStockOnly) list = list.filter((p) => stockStatus(p) !== 'agotado')

  switch (opts.sort) {
    case 'price-asc':
      list.sort((a, b) => a.priceCOP - b.priceCOP)
      break
    case 'price-desc':
      list.sort((a, b) => b.priceCOP - a.priceCOP)
      break
    case 'name':
      list.sort((a, b) => a.name.localeCompare(b.name, 'es'))
      break
    default:
      list.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
  }

  return list
}
