import { newsFallback } from '../data/newsFallback'
import type { NewsItem } from '../data/types'
import { STORAGE_KEYS } from './storage'

const FEEDS = [
  {
    source: 'The Verge',
    url: 'https://www.theverge.com/rss/index.xml',
  },
  {
    source: 'TechCrunch',
    url: 'https://techcrunch.com/feed/',
  },
  {
    source: 'Ars Technica',
    url: 'https://feeds.arstechnica.com/arstechnica/index',
  },
]

const PROXIES = [
  (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  (u: string) => `https://corsproxy.io/?${encodeURIComponent(u)}`,
]

const CACHE_TTL_MS = 25 * 60 * 1000

type CacheShape = { t: number; items: NewsItem[] }

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
      const n = nodes[0]
      const t = n.textContent?.trim()
      if (t) return t
    }
  }
  return null
}

function parseFeed(xmlText: string, source: string): NewsItem[] {
  const doc = new DOMParser().parseFromString(xmlText, 'text/xml')
  if (doc.querySelector('parsererror')) return []

  const items = Array.from(doc.querySelectorAll('item, entry'))
  return items.slice(0, 12).map((el, i) => {
    const title = textOf(el, ['title']) ?? 'Sin título'
    const link =
      textOf(el, ['link']) ??
      el.getElementsByTagName('link')[0]?.getAttribute('href') ??
      '#'
    const date =
      textOf(el, ['pubDate', 'published', 'updated', 'dc:date']) ??
      new Date().toISOString()
    const desc =
      textOf(el, ['description', 'summary', 'content', 'content:encoded']) ?? ''
    return {
      id: `${source}-${i}-${hash(title)}`,
      title: stripHtml(title),
      link: link.trim(),
      source,
      date: new Date(date).toISOString(),
      summary: stripHtml(desc).slice(0, 280),
    }
  })
}

function hash(s: string): string {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h).toString(36)
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
      const parsed = parseFeed(text, source)
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
      const data = JSON.parse(cached) as CacheShape
      if (Date.now() - data.t < CACHE_TTL_MS && data.items.length > 0) {
        return { items: data.items, ok: true }
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
