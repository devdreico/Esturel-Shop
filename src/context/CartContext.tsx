import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getProductById, unitPrice, maxQty, productImage, stockStatus, variantStock } from '../data/products'
import type { CartLine, ResolvedLine } from '../data/types'
import { STORAGE_KEYS, readCartLines, writeJSON } from '../lib/storage'
import { quoteShipping } from '../lib/shipping'

export type CartContextValue = {
  lines: CartLine[]
  items: ResolvedLine[]
  count: number
  total: number
  subtotal: number
  shipping: number
  grandTotal: number
  isOpen: boolean
  lastAddedKey: string | null
  openCart: () => void
  closeCart: () => void
  addItem: (productId: string, qty?: number, variantId?: string) => boolean
  removeItem: (key: string) => void
  setQty: (key: string, qty: number) => void
  clearCart: () => void
  hasUnavailable: boolean
}

export const CartContext = createContext<CartContextValue | null>(null)

function clampQty(qty: number): number {
  if (!Number.isFinite(qty)) return 1
  return Math.min(Math.max(Math.floor(qty), 1), 99)
}

function lineKey(line: CartLine): string {
  return `${line.productId}::${line.variantId ?? ''}`
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => readCartLines())
  const [isOpen, setIsOpen] = useState(false)
  const [lastAddedKey, setLastAddedKey] = useState<string | null>(null)

  useEffect(() => {
    writeJSON(STORAGE_KEYS.cart, lines)
  }, [lines])

  useEffect(() => {
    if (!lastAddedKey) return
    const t = window.setTimeout(() => setLastAddedKey(null), 2500)
    return () => window.clearTimeout(t)
  }, [lastAddedKey])

  const addItem = useCallback((productId: string, qty = 1, variantId?: string) => {
    const product = getProductById(productId)
    if (!product) return false
    const variant = variantId ? product.variants?.find((v) => v.id === variantId) : undefined
    if (variantId && !variant) return false
    if (product.variants?.length && !variantId) {
      // Requiere selección de variante en la ficha.
      return false
    }
    const cap = maxQty(product, variantId)
    if (cap <= 0 && product.stockPolicy !== 'backorder') return false

    const nextQty = clampQty(qty)
    setLines((prev) => {
      const found = prev.find((l) => l.productId === productId && (l.variantId ?? '') === (variantId ?? ''))
      if (found) {
        const newQty = clampQty(found.qty + nextQty)
        return prev.map((l) =>
          l.productId === productId && (l.variantId ?? '') === (variantId ?? '')
            ? { ...l, qty: newQty }
            : l,
        )
      }
      return [...prev, { productId, ...(variantId ? { variantId } : {}), qty: nextQty }]
    })
    setLastAddedKey(lineKey({ productId, variantId, qty: nextQty }))
    setIsOpen(true)
    return true
  }, [])

  const removeItem = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => lineKey(l) !== key))
  }, [])

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) => {
      const line = prev.find((l) => lineKey(l) === key)
      if (!line) return prev
      const product = getProductById(line.productId)
      if (!product) return prev
      if (qty <= 0) return prev.filter((l) => lineKey(l) !== key)
      const cap = maxQty(product, line.variantId)
      const q = cap > 0 ? Math.min(clampQty(qty), cap) : clampQty(qty)
      return prev.map((l) => (lineKey(l) === key ? { ...l, qty: q } : l))
    })
  }, [])

  const clearCart = useCallback(() => setLines([]), [])

  const items = useMemo<ResolvedLine[]>(() => {
    return lines
      .map((l) => {
        const product = getProductById(l.productId)
        if (!product) return null
        const variant = l.variantId
          ? product.variants?.find((v) => v.id === l.variantId)
          : undefined
        if (l.variantId && !variant) return null
        const qty = clampQty(l.qty)
        const unit = unitPrice(product, l.variantId)
        const cap = maxQty(product, l.variantId)
        const stock = variantStock(product, l.variantId)
        return {
          key: lineKey(l),
          product,
          ...(variant ? { variant } : {}),
          qty,
          unitPrice: unit,
          lineTotal: unit * qty,
          image: productImage(product, l.variantId),
          label: variant ? `${product.name} · ${variant.label}` : product.name,
          stock,
          maxQty: cap,
        }
      })
      .filter((x): x is ResolvedLine => x !== null)
  }, [lines])

  const count = items.reduce((s, i) => s + i.qty, 0)
  const subtotal = items.reduce((s, i) => s + i.lineTotal, 0)

  const shippingQuote = quoteShipping(subtotal)
  const shipping = items.length === 0 ? 0 : shippingQuote.shipping
  const grandTotal = subtotal + shipping

  const hasUnavailable = items.some((i) => stockStatus(i.product, i.variant?.id) === 'agotado')

  const value = useMemo(
    () => ({
      lines: items.map(({ product, variant, qty }) => ({
        productId: product.id,
        ...(variant ? { variantId: variant.id } : {}),
        qty,
      })),
      items,
      count,
      total: subtotal,
      subtotal,
      shipping,
      grandTotal,
      isOpen,
      lastAddedKey,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      removeItem,
      setQty,
      clearCart,
      hasUnavailable,
    }),
    [items, count, subtotal, shipping, grandTotal, isOpen, lastAddedKey, addItem, removeItem, setQty, clearCart, hasUnavailable],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
