import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getProductById } from '../data/products'
import type { CartLine, Product } from '../data/types'
import { STORAGE_KEYS, readJSON, writeJSON } from '../lib/storage'

export type ResolvedLine = { product: Product; qty: number; lineTotal: number }

export type CartContextValue = {
  lines: CartLine[]
  items: ResolvedLine[]
  count: number
  total: number
  isOpen: boolean
  lastAddedId: string | null
  openCart: () => void
  closeCart: () => void
  addItem: (productId: string, qty?: number) => void
  removeItem: (productId: string) => void
  setQty: (productId: string, qty: number) => void
  clearCart: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() =>
    readJSON<CartLine[]>(STORAGE_KEYS.cart, []),
  )
  const [isOpen, setIsOpen] = useState(false)
  const [lastAddedId, setLastAddedId] = useState<string | null>(null)

  useEffect(() => {
    writeJSON(STORAGE_KEYS.cart, lines)
  }, [lines])

  useEffect(() => {
    if (!lastAddedId) return
    const t = window.setTimeout(() => setLastAddedId(null), 2500)
    return () => window.clearTimeout(t)
  }, [lastAddedId])

  const addItem = useCallback((productId: string, qty = 1) => {
    setLines((prev) => {
      const found = prev.find((l) => l.productId === productId)
      if (found) {
        return prev.map((l) =>
          l.productId === productId ? { ...l, qty: Math.min(l.qty + qty, 99) } : l,
        )
      }
      return [...prev, { productId, qty }]
    })
    setLastAddedId(productId)
    setIsOpen(true)
  }, [])

  const removeItem = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId))
  }, [])

  const setQty = useCallback((productId: string, qty: number) => {
    setLines((prev) => {
      if (qty <= 0) return prev.filter((l) => l.productId !== productId)
      return prev.map((l) => (l.productId === productId ? { ...l, qty: Math.min(qty, 99) } : l))
    })
  }, [])

  const clearCart = useCallback(() => setLines([]), [])

  const items = useMemo<ResolvedLine[]>(() => {
    return lines
      .map((l) => {
        const product = getProductById(l.productId)
        if (!product) return null
        return { product, qty: l.qty, lineTotal: product.priceCOP * l.qty }
      })
      .filter((x): x is ResolvedLine => x !== null)
  }, [lines])

  const count = items.reduce((s, i) => s + i.qty, 0)
  const total = items.reduce((s, i) => s + i.lineTotal, 0)

  const value = useMemo(
    () => ({
      lines: items.map(({ product, qty }) => ({ productId: product.id, qty })),
      items,
      count,
      total,
      isOpen,
      lastAddedId,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      removeItem,
      setQty,
      clearCart,
    }),
    [items, count, total, isOpen, lastAddedId, addItem, removeItem, setQty, clearCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
