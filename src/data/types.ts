export type ProductCategory =
  | 'audifonos'
  | 'perifericos'
  | 'frontier'
  | 'accesorios'
  | 'streaming'

export type StockHint = 'disponible' | 'pedido' | 'agotado'

export type Product = {
  id: string
  slug: string
  name: string
  category: ProductCategory
  priceCOP: number
  image: string
  shortDesc: string
  description: string
  specs: string[]
  featured?: boolean
  mpPaymentLink: string
  stockHint?: StockHint
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
  qty: number
}
