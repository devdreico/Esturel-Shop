import type { CartLine } from '../data/types'
import { getProductById } from '../data/products'

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* quota / private mode */
  }
}

export function sanitizeCartLines(raw: unknown): CartLine[] {
  if (!Array.isArray(raw)) return []
  const out: CartLine[] = []
  for (const entry of raw) {
    if (!entry || typeof entry !== 'object') continue
    const { productId, qty } = entry as { productId?: unknown; qty?: unknown }
    if (typeof productId !== 'string') continue
    if (!getProductById(productId)) continue
    const n = Number(qty)
    if (!Number.isFinite(n) || n < 1) continue
    const q = Math.min(Math.floor(n), 99)
    if (out.some((l) => l.productId === productId)) continue
    out.push({ productId, qty: q })
  }
  return out
}

export function readCartLines(): CartLine[] {
  return sanitizeCartLines(readJSON<unknown>(STORAGE_KEYS.cart, []))
}

export const STORAGE_KEYS = {
  cart: 'esturel-cart',
  theme: 'esturel-theme',
  newsCache: 'esturel-news-cache',
} as const
