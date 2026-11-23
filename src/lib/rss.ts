import { site } from '../config/site'
import type { NewsItem } from '../data/types'
import { STORAGE_KEYS } from './storage'

const CACHE_TTL_MS = 25 * 60 * 1000

type CacheShape = { t: number; items: NewsItem[]; ok: boolean }

function isValidCache(data: unknown): data is CacheShape {
  if (!data || typeof data !== 'object') return false
  const d = data as CacheShape
  return typeof d.t === 'number' && Array.isArray(d.items)
}

function readCache(): CacheShape | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.newsCache)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return isValidCache(parsed) ? parsed : null
  } catch {
    return null
  }
}

function writeCache(cache: CacheShape): void {
  try {
    localStorage.setItem(STORAGE_KEYS.newsCache, JSON.stringify(cache))
  } catch {
    /* quota / private mode */
  }
}

export async function fetchTechNews(opts: { force?: boolean } = {}): Promise<{
  items: NewsItem[]
  ok: boolean
  fetchedAt: number
}> {
  const cached = readCache()
  const now = Date.now()
  if (!opts.force && cached && now - cached.t < CACHE_TTL_MS) {
    return { items: cached.items, ok: cached.ok, fetchedAt: cached.t }
  }

  const endpoint = site.integrations.newsEndpoint || '/api/news'
  try {
    const res = await fetch(endpoint, { headers: { Accept: 'application/json' } })
    if (!res.ok) throw new Error(`news endpoint ${res.status}`)
    const data = (await res.json()) as { items?: NewsItem[]; fetchedAt?: number; ok?: boolean }
    const items = Array.isArray(data.items) ? data.items : []
    const ok = data.ok !== false && items.length > 0
    const fetchedAt = typeof data.fetchedAt === 'number' ? data.fetchedAt : now
    const cache: CacheShape = { t: now, items, ok }
    writeCache(cache)
    return { items, ok, fetchedAt }
  } catch {
    if (cached) {
      return { items: cached.items, ok: cached.ok, fetchedAt: cached.t }
    }
    // Último recurso: fallback local.
    try {
      const { newsFallback } = await import('../data/newsFallback')
      return { items: newsFallback, ok: false, fetchedAt: now }
    } catch {
      return { items: [], ok: false, fetchedAt: now }
    }
  }
}
