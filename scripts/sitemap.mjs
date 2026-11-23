import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const DIST = path.join(ROOT, 'dist')
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/site.json'), 'utf8'))
const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/products.json'), 'utf8'))

const BASE = site.brand.url.replace(/\/+$/, '')
const today = new Date().toISOString().slice(0, 10)

const urls = []
const add = (pathStr, changefreq, priority) => {
  urls.push({ loc: `${BASE}${pathStr}`, changefreq, priority, lastmod: today })
}

add('/', 'weekly', '1.0')
add('/catalogo', 'daily', '0.9')
add('/noticias', 'daily', '0.7')
add('/asesor', 'monthly', '0.6')
add('/faq', 'monthly', '0.5')
add('/contacto', 'monthly', '0.5')
for (const slug of ['privacidad', 'terminos', 'envios', 'devoluciones', 'garantia']) {
  add(`/${slug}`, 'yearly', '0.3')
}
for (const p of products) {
  add(`/producto/${p.slug}`, 'weekly', '0.8')
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

if (!fs.existsSync(DIST)) {
  console.error('dist/ no existe. Ejecuta build primero.')
  process.exit(1)
}
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), xml)
console.log(`sitemap.xml generado con ${urls.length} URLs.`)
