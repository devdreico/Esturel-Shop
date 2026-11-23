import rawSite from '../../content/site.json'

export type SiteConfig = {
  brand: {
    name: string
    legalName: string
    tagline: string
    description: string
    url: string
    locale: string
    currency: string
    logo: string
    ogImage: string
  }
  contact: {
    whatsappNumber: string
    whatsappDisplay: string
    email: string
    instagram: string
    instagramHandle: string
    city: string
    hours: string
    responseTime: string
  }
  business: {
    nit: string
    address: string
    city: string
    country: string
  }
  announcement: {
    enabled: boolean
    text: string
    linkLabel: string
    linkHref: string
  }
  hero: {
    eyebrow: string
    title: string
    titleAccent: string
    titleEnd: string
    subtitle: string
    bullets: string[]
    primaryCta: string
    secondaryCta: string
  }
  cta: {
    product: string
    productUnavailable: string
    cart: string
    checkout: string
    whatsapp: string
    advisor: string
    emptyCart: string
    viewProduct: string
    addToCart: string
  }
  shipping: {
    flatRateCOP: number
    freeFromCOP: number
    estimate: string
    coverage: string
    note: string
  }
  payments: {
    cod: boolean
    online: boolean
    codNote: string
  }
  features: {
    news: boolean
    advisor: boolean
    analyticsConsent: boolean
  }
  integrations: {
    formspreeEndpoint: string
    supabaseUrl: string
    supabaseAnonKey: string
    newsEndpoint: string
    ga4Id: string
    metaPixelId: string
    umamiScriptUrl: string
    umamiWebsiteId: string
  }
  partners: {
    paceformName: string
    paceformUrl: string
    paceformBlurb: string
  }
  legal: {
    lastUpdated: string
    returnsDays: number
    warrantyMonthsDefault: number
  }
}

const env = import.meta.env

function envString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined
}

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '')
}

/** Acepta 3001234567, +57 300 123 4567 o 573001234567. */
export function normalizeWhatsAppNumber(value: string): string {
  const digits = digitsOnly(value)
  if (digits.length === 10 && digits.startsWith('3')) return `57${digits}`
  if (digits.length === 12 && digits.startsWith('57')) return digits
  return digits
}

export function formatWhatsAppDisplay(digits: string): string {
  if (digits.length === 12 && digits.startsWith('57')) {
    const local = digits.slice(2)
    return `+57 ${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`
  }
  return digits ? `+${digits}` : ''
}

const base = rawSite as SiteConfig
const whatsappNumber = normalizeWhatsAppNumber(
  envString(env.VITE_WHATSAPP_NUMBER) ?? base.contact.whatsappNumber,
)

export const site: SiteConfig = {
  ...base,
  brand: {
    ...base.brand,
    name: envString(env.VITE_BRAND_NAME) ?? base.brand.name,
    url: (envString(env.VITE_SITE_URL) ?? base.brand.url).replace(/\/+$/, ''),
    ogImage: envString(env.VITE_OG_IMAGE) ?? base.brand.ogImage,
  },
  contact: {
    ...base.contact,
    whatsappNumber,
    whatsappDisplay: formatWhatsAppDisplay(whatsappNumber),
    email: envString(env.VITE_CONTACT_EMAIL) ?? base.contact.email,
    instagram: envString(env.VITE_INSTAGRAM_URL) ?? base.contact.instagram,
  },
  business: {
    ...base.business,
    nit: envString(env.VITE_BUSINESS_NIT) ?? base.business.nit,
    address: envString(env.VITE_BUSINESS_ADDRESS) ?? base.business.address,
  },
  announcement: {
    ...base.announcement,
    enabled: envString(env.VITE_ANNOUNCEMENT) === 'off' ? false : base.announcement.enabled,
    text: envString(env.VITE_ANNOUNCEMENT_TEXT) ?? base.announcement.text,
  },
  integrations: {
    ...base.integrations,
    formspreeEndpoint:
      envString(env.VITE_FORMSPREE_ENDPOINT) ?? base.integrations.formspreeEndpoint,
    supabaseUrl: envString(env.VITE_SUPABASE_URL) ?? base.integrations.supabaseUrl,
    supabaseAnonKey:
      envString(env.VITE_SUPABASE_ANON_KEY) ?? base.integrations.supabaseAnonKey,
    newsEndpoint: envString(env.VITE_NEWS_ENDPOINT) ?? base.integrations.newsEndpoint,
    ga4Id: envString(env.VITE_GA4_ID) ?? base.integrations.ga4Id,
    metaPixelId: envString(env.VITE_META_PIXEL_ID) ?? base.integrations.metaPixelId,
    umamiScriptUrl:
      envString(env.VITE_UMAMI_SCRIPT_URL) ?? base.integrations.umamiScriptUrl,
    umamiWebsiteId:
      envString(env.VITE_UMAMI_WEBSITE_ID) ?? base.integrations.umamiWebsiteId,
  },
  partners: {
    ...base.partners,
    paceformUrl: envString(env.VITE_PACEFORM_URL) ?? base.partners.paceformUrl,
  },
}

export const SITE_URL = site.brand.url
export const SITE_NAME = site.brand.name
export const WHATSAPP_NUMBER = site.contact.whatsappNumber
export const WHATSAPP_DISPLAY = site.contact.whatsappDisplay

export const supabaseConfigured = Boolean(
  site.integrations.supabaseUrl && site.integrations.supabaseAnonKey,
)
export const formspreeConfigured = Boolean(site.integrations.formspreeEndpoint)
export const analyticsConfigured = Boolean(
  site.integrations.ga4Id ||
    site.integrations.metaPixelId ||
    (site.integrations.umamiScriptUrl && site.integrations.umamiWebsiteId),
)
