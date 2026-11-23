import { site, SITE_URL, SITE_NAME } from '../config/site'

export type SeoInput = {
  title: string
  description: string
  path?: string
  image?: string
  noindex?: boolean
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

export function absoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return SITE_URL
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  const path = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`
  return `${SITE_URL}${path}`
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
  image = site.brand.ogImage,
  noindex = false,
  jsonLd,
}: SeoInput): void {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} · ${SITE_NAME}`
  const url = absoluteUrl(path)
  const absImage = absoluteUrl(image)

  document.title = fullTitle
  upsertMeta('name', 'description', description)
  upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
  upsertLink('canonical', url)

  upsertMeta('property', 'og:site_name', SITE_NAME)
  upsertMeta('property', 'og:type', path.startsWith('/producto/') ? 'product' : 'website')
  upsertMeta('property', 'og:locale', site.brand.locale)
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

export function organizationJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl(site.brand.logo),
    sameAs: [site.contact.instagram],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'es',
      telephone: `+${site.contact.whatsappNumber}`,
      url: `https://wa.me/${site.contact.whatsappNumber}`,
    },
  }
}

export function websiteJsonLd(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: site.brand.locale,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/catalogo?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function productJsonLd(input: {
  name: string
  description: string
  slug: string
  priceCOP: number
  image: string
  brand: string
  sku: string
  availability: string
  condition: string
  warrantyMonths: number
}): Record<string, unknown> {
  const stockMap: Record<string, string> = {
    disponible: 'https://schema.org/InStock',
    pedido: 'https://schema.org/PreOrder',
    agotado: 'https://schema.org/OutOfStock',
  }
  const conditionMap: Record<string, string> = {
    nuevo: 'https://schema.org/NewCondition',
    reacondicionado: 'https://schema.org/RefurbishedCondition',
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: input.name,
    description: input.description,
    image: absoluteUrl(input.image),
    sku: input.sku,
    brand: { '@type': 'Brand', name: input.brand },
    offers: {
      '@type': 'Offer',
      price: input.priceCOP,
      priceCurrency: 'COP',
      availability: stockMap[input.availability] ?? 'https://schema.org/InStock',
      itemCondition: conditionMap[input.condition] ?? 'https://schema.org/NewCondition',
      url: absoluteUrl(`/producto/${input.slug}`),
    },
  }
}

export function breadcrumbJsonLd(crumbs: { name: string; path: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  }
}

export function faqJsonLd(items: { q: string; a: string }[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  }
}
