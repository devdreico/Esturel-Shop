export const SITE_URL = (
  import.meta.env.VITE_SITE_URL ?? 'https://esturel.shop'
).replace(/\/$/, '')

export const SITE_NAME = 'Esturel'

export type SeoInput = {
  title: string
  description: string
  path?: string
  image?: string
  noindex?: boolean
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function upsertJsonLd(id: string, data: unknown) {
  let el = document.getElementById(id) as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.id = id
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

export function applySeo({
  title,
  description,
  path = '/',
  image = '/esturel-logo.png',
  noindex = false,
  jsonLd,
}: SeoInput): void {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} · ${SITE_NAME}`
  const url = `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
  const absImage = image.startsWith('http') ? image : `${SITE_URL}${image}`

  document.title = fullTitle
  upsertMeta('name', 'description', description)
  upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')

  upsertLink('canonical', url)

  upsertMeta('property', 'og:site_name', SITE_NAME)
  upsertMeta('property', 'og:type', path.startsWith('/producto/') ? 'product' : 'website')
  upsertMeta('property', 'og:locale', 'es_CO')
  upsertMeta('property', 'og:title', fullTitle)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:url', url)
  upsertMeta('property', 'og:image', absImage)

  upsertMeta('name', 'twitter:card', 'summary_large_image')
  upsertMeta('name', 'twitter:title', fullTitle)
  upsertMeta('name', 'twitter:description', description)
  upsertMeta('name', 'twitter:image', absImage)

  if (jsonLd) {
    upsertJsonLd('seo-jsonld', jsonLd)
  } else {
    document.getElementById('seo-jsonld')?.remove()
  }
}

export function productJsonLd(p: {
  name: string
  description: string
  slug: string
  priceCOP: number
  image: string
  category: string
  availability?: string
}): Record<string, unknown> {
  const inStock = (p.availability ?? 'disponible') !== 'agotado'
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    url: `${SITE_URL}/producto/${p.slug}`,
    image: `${SITE_URL}${p.image}`,
    brand: { '@type': 'Brand', name: SITE_NAME },
    category: p.category,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'COP',
      price: String(p.priceCOP),
      url: `${SITE_URL}/producto/${p.slug}`,
      availability: inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  }
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}

export function organizationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/esturel-logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      areaServed: 'CO',
      availableLanguage: ['es'],
    },
  }
}
