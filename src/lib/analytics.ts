import { site, analyticsConfigured } from '../config/site'

type Consent = 'granted' | 'denied' | 'unknown'
const CONSENT_KEY = 'esturel-consent'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
    umami?: { track: (event: string, data?: Record<string, unknown>) => void }
    dataLayer?: unknown[]
  }
}

export function getConsent(): Consent {
  try {
    const v = localStorage.getItem(CONSENT_KEY)
    if (v === 'granted' || v === 'denied') return v
  } catch {
    /* private mode */
  }
  return 'unknown'
}

export function setConsent(value: 'granted' | 'denied'): void {
  try {
    localStorage.setItem(CONSENT_KEY, value)
  } catch {
    /* private mode */
  }
  window.dispatchEvent(new CustomEvent('esturel:consent', { detail: value }))
  if (value === 'granted') initAnalytics()
}

export function hasAnalytics(): boolean {
  return analyticsConfigured
}

let initialized = false

function injectScript(src: string, attrs: Record<string, string> = {}): void {
  if (document.querySelector(`script[src="${src}"]`)) return
  const s = document.createElement('script')
  s.src = src
  s.async = true
  for (const [k, v] of Object.entries(attrs)) s.setAttribute(k, v)
  document.head.appendChild(s)
}

export function initAnalytics(): void {
  if (initialized || !analyticsConfigured || getConsent() !== 'granted') return
  initialized = true

  const { ga4Id, metaPixelId, umamiScriptUrl, umamiWebsiteId } = site.integrations

  if (ga4Id) {
    injectScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`)
    window.dataLayer = window.dataLayer ?? []
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', ga4Id, { anonymize_ip: true })
  }

  if (metaPixelId) {
    const w = window as unknown as { fbq?: (...a: unknown[]) => void }
    if (!w.fbq) {
      const n: any = function (...args: unknown[]) {
        n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args)
      }
      n.push = n
      n.loaded = true
      n.version = '2.0'
      n.queue = []
      w.fbq = n
      const t = document.createElement('script')
      t.async = true
      t.src = 'https://connect.facebook.net/en_US/fbevents.js'
      document.head.appendChild(t)
    }
    window.fbq?.('init', metaPixelId)
    window.fbq?.('track', 'PageView')
  }

  if (umamiScriptUrl && umamiWebsiteId) {
    injectScript(umamiScriptUrl, { 'data-website-id': umamiWebsiteId, defer: '' })
  }
}

export function track(event: string, params?: Record<string, unknown>): void {
  if (!analyticsConfigured || getConsent() !== 'granted') return
  const { ga4Id, metaPixelId } = site.integrations

  if (ga4Id && typeof window.gtag === 'function') {
    window.gtag('event', event, params ?? {})
  }

  if (metaPixelId && typeof window.fbq === 'function') {
    const map: Record<string, string> = {
      view_item: 'ViewContent',
      add_to_cart: 'AddToCart',
      begin_checkout: 'InitiateCheckout',
      purchase: 'Purchase',
      whatsapp_click: 'Contact',
    }
    const fbEvent = map[event]
    if (fbEvent) window.fbq('track', fbEvent, params ?? {})
  }

  if (window.umami?.track) window.umami.track(event, params)
}

export function trackViewItem(product: { sku: string; name: string; priceCOP: number; category: string }) {
  track('view_item', {
    currency: 'COP',
    value: product.priceCOP,
    items: [
      { item_id: product.sku, item_name: product.name, item_category: product.category, price: product.priceCOP, quantity: 1 },
    ],
  })
}

export function trackAddToCart(product: { sku: string; name: string; priceCOP: number; category: string }, qty: number) {
  track('add_to_cart', {
    currency: 'COP',
    value: product.priceCOP * qty,
    items: [{ item_id: product.sku, item_name: product.name, item_category: product.category, price: product.priceCOP, quantity: qty }],
  })
}

export function trackBeginCheckout(items: { sku: string; name: string; priceCOP: number; qty: number; category?: string }[], total: number) {
  track('begin_checkout', {
    currency: 'COP',
    value: total,
    items: items.map((i) => ({ item_id: i.sku, item_name: i.name, price: i.priceCOP, quantity: i.qty })),
  })
}

export function trackPurchase(order: { code: string; total: number }, items: { sku: string; name: string; priceCOP: number; qty: number }[]) {
  track('purchase', {
    transaction_id: order.code,
    currency: 'COP',
    value: order.total,
    items: items.map((i) => ({ item_id: i.sku, item_name: i.name, price: i.priceCOP, quantity: i.qty })),
  })
}

export function trackWhatsApp(context: string) {
  track('whatsapp_click', { context })
}
