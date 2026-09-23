import { newsFallback } from '../data/newsFallback'
import type { NewsItem } from '../data/types'
import { STORAGE_KEYS } from './storage'

const FEEDS = [
  { source: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
  { source: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
  { source: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index' },
]

const PROXIES = [
  (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  (u: string) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
]

const CACHE_TTL_MS = 25 * 60 * 1000

type CacheShape = { t: number; items: NewsItem[] }

export function safeHttpsUrl(raw: string): string | null {
  try {
    const u = new URL(raw.trim())
    if (u.protocol !== 'https:') return null
    if (u.hostname === 'javascript' || u.hostname.includes('javascript')) return null
    return u.toString()
  } catch {
    return null
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function textOf(parent: Element | Document, tags: string[]): string | null {
  for (const tag of tags) {
    const nodes = parent.getElementsByTagName(tag)
    if (nodes.length > 0) {
      const t = nodes[0]?.textContent?.trim()
      if (t) return t
    }
  }
  return null
}

function safeIsoDate(raw: string): string {
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return new Date().toISOString()
  return d.toISOString()
}

function parseFeed(xmlText: string, source: string): NewsItem[] {
  const doc = new DOMParser().parseFromString(xmlText, 'text/xml')
  if (doc.querySelector('parsererror')) return []

  const items = Array.from(doc.querySelectorAll('item, entry'))
  const out: NewsItem[] = []

  for (const [i, el] of items.slice(0, 12).entries()) {
    const title = textOf(el, ['title']) ?? 'Sin título'
    const rawLink =
      textOf(el, ['link']) ??
      el.getElementsByTagName('link')[0]?.getAttribute('href') ??
      ''
    const link = safeHttpsUrl(rawLink)
    if (!link) continue

    const date = textOf(el, ['pubDate', 'published', 'updated', 'dc:date'])
    const desc = textOf(el, ['description', 'summary', 'content', 'content:encoded']) ?? ''

    out.push({
      id: `${source}-${i}-${hash(title)}`,
      title: stripHtml(title),
      link,
      source,
      date: safeIsoDate(date ?? ''),
      summary: stripHtml(desc).slice(0, 280),
    })
  }
  return out
}

function hash(s: string): string {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h).toString(36)
}

function isValidCache(data: unknown): data is CacheShape {
  if (!data || typeof data !== 'object') return false
  const d = data as CacheShape
  return (
    typeof d.t === 'number' &&
    Array.isArray(d.items) &&
    d.items.every(
      (it) =>
        it &&
        typeof it.title === 'string' &&
        typeof it.link === 'string' &&
        typeof it.id === 'string',
    )
  )
}

async function fetchWithTimeout(url: string, ms = 9000): Promise<Response> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), ms)
  try {
    return await fetch(url, { signal: ctrl.signal })
  } finally {
    clearTimeout(timer)
  }
}

async function loadFeed(source: string, feedUrl: string): Promise<NewsItem[]> {
  let lastErr: unknown
  for (const proxy of PROXIES) {
    try {
      const res = await fetchWithTimeout(proxy(feedUrl))
      if (!res.ok) throw new Error(String(res.status))
      const text = await res.text()
      const parsed = parseFeed(text, source).filter((n) => safeHttpsUrl(n.link))
      if (parsed.length > 0) return parsed
    } catch (e) {
      lastErr = e
    }
  }
  throw lastErr ?? new Error('feed failed')
}

export async function fetchTechNews(): Promise<{ items: NewsItem[]; ok: boolean }> {
  try {
    const cached = localStorage.getItem(STORAGE_KEYS.newsCache)
    if (cached) {
      const data: unknown = JSON.parse(cached)
      if (isValidCache(data) && Date.now() - data.t < CACHE_TTL_MS && data.items.length > 0) {
        return {
          items: data.items.filter((i) => Boolean(safeHttpsUrl(i.link))),
          ok: true,
        }
      }
    }
  } catch {
    /* ignore */
  }

  try {
    const results = await Promise.allSettled(FEEDS.map((f) => loadFeed(f.source, f.url)))
    const items = results
      .flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
      .filter((it) => it.title && it.link)
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
      .slice(0, 24)

    if (items.length === 0) throw new Error('empty')

    try {
      localStorage.setItem(STORAGE_KEYS.newsCache, JSON.stringify({ t: Date.now(), items }))
    } catch {
      /* ignore */
    }
    return { items, ok: true }
  } catch {
    return { items: newsFallback, ok: false }
  }
}
