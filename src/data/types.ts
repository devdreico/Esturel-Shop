export type ProductCategory =
  | 'audifonos'
  | 'perifericos'
  | 'frontier'
  | 'accesorios'
  | 'streaming'

export type StockPolicy = 'deny' | 'backorder'

export type ProductCondition = 'nuevo' | 'reacondicionado'

export type StockStatus = 'disponible' | 'pedido' | 'agotado'

export type ProductSpec = {
  label: string
  value: string
}

export type ProductVariant = {
  id: string
  label: string
  sku: string
  stock: number
  priceCOP?: number
  image?: string
}

export type Product = {
  id: string
  sku: string
  slug: string
  name: string
  brand: string
  category: ProductCategory
  priceCOP: number
  compareAtCOP?: number
  image: string
  images: string[]
  shortDesc: string
  description: string
  specs: ProductSpec[]
  features?: string[]
  variants?: ProductVariant[]
  stock: number
  stockPolicy: StockPolicy
  condition: ProductCondition
  warrantyMonths: number
  weightG?: number
  dimensionsCm?: string
  badge?: string
  featured?: boolean
  tags?: string[]
  metaTitle?: string
  metaDescription?: string
  /** Marca los productos de demostración. `npm run launch:check` falla si queda alguno. */
  isDemo?: boolean
}

export type Category = {
  id: ProductCategory
  label: string
  blurb: string
  emoji: string
}

export type NewsItem = {
  id: string
  title: string
  link: string
  source: string
  date: string
  summary: string
}

export type CartLine = {
  productId: string
  variantId?: string
  qty: number
}

export type ResolvedLine = {
  /** Clave única de la línea: producto o producto + variante. */
  key: string
  product: Product
  variant?: ProductVariant
  qty: number
  unitPrice: number
  lineTotal: number
  image: string
  label: string
  stock: number
  maxQty: number
}

export type CustomerAddress = {
  nombre: string
  celular: string
  correo: string
  departamento: string
  ciudad: string
  direccion: string
  notas: string
}

export type OrderItemInput = {
  productId: string
  variantId?: string
  qty: number
}

export type ShippingQuote = {
  subtotal: number
  shipping: number
  total: number
  freeShipping: boolean
  remainingForFree: number
}

export type OrderStatus =
  | 'pendiente'
  | 'confirmado'
  | 'despachado'
  | 'entregado'
  | 'cancelado'
  | 'devuelto'

export type CreatedOrder = {
  code: string
  status: OrderStatus
  subtotal: number
  shipping: number
  total: number
  createdAt: string
  /** true cuando el pedido se guardó en Supabase; false si solo se notificó. */
  persisted: boolean
}
