import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const DIST = path.join(ROOT, 'dist')
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/site.json'), 'utf8'))
const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/products.json'), 'utf8'))

const BASE = site.brand.url.replace(/\/+$/, '')
const abs = (p) => (p.startsWith('http') ? p : `${BASE}${p.startsWith('/') ? p : '/' + p}`)

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function ogImageFor(img) {
  if (!img || img.endsWith('.svg')) return site.brand.ogImage
  return img
}

function replaceTag(html, regex, replacement) {
  if (regex.test(html)) return html.replace(regex, replacement)
  return html
}

function inject(html, { title, description, canonical, image, jsonLd, noindex }) {
  const t = esc(title)
  const d = esc(description)
  const c = esc(canonical)
  const im = esc(abs(ogImageFor(image)))
  let out = html
  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${t}</title>`)
  out = out.replace(/<meta name="description" content="[^"]*"\s*\/?>/i, `<meta name="description" content="${d}" />`)
  out = out.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${c}" />`)
  out = out.replace(/<meta property="og:title" content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${t}" />`)
  out = out.replace(/<meta property="og:description" content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${d}" />`)
  out = out.replace(/<meta property="og:url" content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${c}" />`)
  out = out.replace(/<meta property="og:image" content="[^"]*"\s*\/?>/i, `<meta property="og:image" content="${im}" />`)
  out = out.replace(/<meta name="twitter:title" content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${t}" />`)
  out = out.replace(/<meta name="twitter:description" content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${d}" />`)
  out = out.replace(/<meta name="twitter:image" content="[^"]*"\s*\/?>/i, `<meta name="twitter:image" content="${im}" />`)
  out = out.replace(/<meta name="robots" content="[^"]*"\s*\/?>/i, `<meta name="robots" content="${noindex ? 'noindex, nofollow' : 'index, follow'}" />`)

  if (jsonLd) {
    const arr = Array.isArray(jsonLd) ? jsonLd : [jsonLd]
    const scripts = arr
      .map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`)
      .join('\n')
    out = out.replace(/<\/head>/i, `${scripts}\n</head>`)
  }

  const noscript = `<noscript><main style="max-width:720px;margin:2rem auto;padding:0 1rem;font-family:system-ui,sans-serif"><h1>${t}</h1><p>${d}</p><p><a href="/catalogo">Ver catálogo</a> · <a href="https://wa.me/${site.contact.whatsappNumber}">WhatsApp</a></p></main></noscript>`
  out = out.replace(/<\/body>/i, `${noscript}\n</body>`)
  return out
}

function productJsonLd(p, price, image) {
  const stockMap = { disponible: 'https://schema.org/InStock', pedido: 'https://schema.org/PreOrder', agotado: 'https://schema.org/OutOfStock' }
  const condMap = { nuevo: 'https://schema.org/NewCondition', reacondicionado: 'https://schema.org/RefurbishedCondition' }
  const status = p.stock > 0 ? 'disponible' : p.stockPolicy === 'backorder' ? 'pedido' : 'agotado'
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    description: p.description,
    image: abs(ogImageFor(image)),
    sku: p.sku,
    brand: { '@type': 'Brand', name: p.brand },
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency: 'COP',
      availability: stockMap[status],
      itemCondition: condMap[p.condition] || 'https://schema.org/NewCondition',
      url: `${BASE}/producto/${p.slug}`,
    },
  }
}

function breadcrumbJsonLd(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.path) })),
  }
}

const baseHtml = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8')

function writeRoute(route, data) {
  const out = inject(baseHtml, data)
  const filePath = route === '/' ? path.join(DIST, 'index.html') : path.join(DIST, route.replace(/^\//, '') + '.html')
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, out)
  console.log('prerendered', route, '->', path.relative(DIST, filePath))
}

const baseTitle = `${site.brand.name} · ${site.brand.tagline}`

// Home
writeRoute('/', {
  title: baseTitle,
  description: site.brand.description,
  canonical: `${BASE}/`,
  image: site.brand.ogImage,
  jsonLd: [
    { '@context': 'https://schema.org', '@type': 'Organization', name: site.brand.name, url: BASE, logo: abs(site.brand.logo) },
    { '@context': 'https://schema.org', '@type': 'WebSite', name: site.brand.name, url: BASE },
  ],
})

// Catalog
writeRoute('/catalogo', {
  title: 'Catálogo de tecnología',
  description: 'Explora audífonos, periféricos, streaming y frontera tech en Colombia. Precios en COP y pago contraentrega.',
  canonical: `${BASE}/catalogo`,
  image: site.brand.ogImage,
})

// News
writeRoute('/noticias', {
  title: 'Noticias tech',
  description: 'Feed de noticias de tecnología: IA, gadgets, audio y más.',
  canonical: `${BASE}/noticias`,
  image: site.brand.ogImage,
})

// Asesor
writeRoute('/asesor', {
  title: 'Asesoría tecnológica',
  description: 'Asesoría personalizada de tecnología en Colombia. Comparamos specs y presupuesto.',
  canonical: `${BASE}/asesor`,
  image: site.brand.ogImage,
})

// FAQ
writeRoute('/faq', {
  title: 'Preguntas frecuentes',
  description: 'Envíos, pagos contraentrega, devoluciones, garantía y más.',
  canonical: `${BASE}/faq`,
  image: site.brand.ogImage,
})

// Contact
writeRoute('/contacto', {
  title: 'Contacto',
  description: 'Canales de contacto de Esturel: WhatsApp, correo e Instagram.',
  canonical: `${BASE}/contacto`,
  image: site.brand.ogImage,
})

// Legal
const legalTitles = {
  privacidad: 'Política de privacidad y tratamiento de datos',
  terminos: 'Términos y condiciones de venta',
  envios: 'Envíos',
  devoluciones: 'Devoluciones y retracto',
  garantia: 'Garantía',
}
for (const slug of Object.keys(legalTitles)) {
  writeRoute(`/${slug}`, {
    title: legalTitles[slug],
    description: `Información sobre ${legalTitles[slug].toLowerCase()} en Esturel.`,
    canonical: `${BASE}/${slug}`,
    image: site.brand.ogImage,
  })
}

// Products
for (const p of products) {
  const price = p.priceCOP
  const image = p.image
  writeRoute(`/producto/${p.slug}`, {
    title: `${p.name} · $${price.toLocaleString('es-CO')}`,
    description: p.shortDesc || p.description,
    canonical: `${BASE}/producto/${p.slug}`,
    image,
    jsonLd: [
      productJsonLd(p, price, image),
      breadcrumbJsonLd([
        { name: 'Inicio', path: '/' },
        { name: 'Catálogo', path: '/catalogo' },
        { name: p.name, path: `/producto/${p.slug}` },
      ]),
    ],
  })
}

console.log(`Prerender listo: ${products.length + 11} rutas.`)
