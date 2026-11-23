import { XMLParser } from 'fast-xml-parser'

const FEEDS = [
  { source: 'The Verge', url: 'https://www.theverge.com/rss/index.xml' },
  { source: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
  { source: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index' },
]

const CACHE_TTL_MS = 5 * 60 * 1000
let cache = { t: 0, items: [], ok: false }

function stripHtml(html) {
  return String(html ?? '')
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

function safeHttpsUrl(raw) {
  try {
    const u = new URL(String(raw ?? '').trim())
    if (u.protocol !== 'https:') return null
    return u.toString()
  } catch {
    return null
  }
}

function safeIsoDate(raw) {
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return new Date().toISOString()
  return d.toISOString()
}

function hash(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h).toString(36)
}

function textOf(el, keys) {
  for (const key of keys) {
    const v = el?.[key]
    if (v == null) continue
    if (typeof v === 'string') return v.trim()
    if (typeof v === 'object') {
      if (typeof v['#text'] === 'string') return v['#text'].trim()
      if (typeof v['@_href'] === 'string') return v['@_href'].trim()
    }
  }
  return null
}

function parseFeed(xmlText, source) {
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' })
  let doc
  try {
    doc = parser.parse(xmlText)
  } catch {
    return []
  }
  const root = doc?.rss?.channel ?? doc?.feed ?? doc
  const rawItems = root?.item ?? root?.entry ?? []
  const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : []

  const out = []
  for (const [i, el] of items.slice(0, 12).entries()) {
    const title = stripHtml(textOf(el, ['title']) ?? 'Sin título')
    const rawLink = textOf(el, ['link']) ?? ''
    const link = safeHttpsUrl(rawLink)
    if (!link) continue
    const date = textOf(el, ['pubDate', 'published', 'updated', 'dc:date'])
    const desc = textOf(el, ['description', 'summary', 'content', 'content:encoded']) ?? ''
    out.push({
      id: `${source}-${i}-${hash(title)}`,
      title,
      link,
      source,
      date: safeIsoDate(date ?? ''),
      summary: stripHtml(desc).slice(0, 280),
    })
  }
  return out
}

export default async function handler(req, res) {
  const now = Date.now()
  if (now - cache.t < CACHE_TTL_MS && cache.items.length) {
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=86400')
    res.status(200).json({ items: cache.items, ok: cache.ok, fetchedAt: cache.t })
    return
  }

  const results = await Promise.allSettled(
    FEEDS.map(async (feed) => {
      const r = await fetch(feed.url, { signal: AbortSignal.timeout(8000) })
      if (!r.ok) throw new Error(String(r.status))
      const xml = await r.text()
      return parseFeed(xml, feed.source)
    }),
  )

  const items = results
    .filter((r) => r.status === 'fulfilled')
    .flatMap((r) => r.value)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 30)

  const ok = items.length > 0
  cache = { t: now, items, ok }
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=86400')
  res.status(200).json({ items, ok, fetchedAt: now })
}
