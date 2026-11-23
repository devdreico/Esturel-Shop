import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.log('sync-products: SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no configurados. Saltando.')
  process.exit(0)
}

const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/products.json'), 'utf8'))

const rows = products.map((p) => ({
  id: p.id,
  sku: p.sku,
  slug: p.slug,
  name: p.name,
  brand: p.brand,
  category: p.category,
  price_cop: p.priceCOP,
  compare_at_cop: p.compareAtCOP ?? null,
  image: p.image,
  images: p.images,
  short_desc: p.shortDesc,
  description: p.description,
  specs: p.specs,
  features: p.features ?? [],
  stock: p.stock,
  stock_policy: p.stockPolicy,
  condition: p.condition,
  warranty_months: p.warrantyMonths,
  weight_g: p.weightG ?? null,
  dimensions_cm: p.dimensionsCm ?? null,
  badge: p.badge ?? null,
  featured: Boolean(p.featured),
  tags: p.tags ?? [],
  is_demo: Boolean(p.isDemo),
  active: true,
  variants: p.variants ?? [],
  updated_at: new Date().toISOString(),
}))

const endpoint = `${url.replace(/\/+$/, '')}/rest/v1/products`
const res = await fetch(endpoint, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    apikey: key,
    Authorization: `Bearer ${key}`,
    Prefer: 'resolution=merge-duplicates,return=minimal',
  },
  body: JSON.stringify(rows),
})

if (!res.ok) {
  const text = await res.text()
  console.error('sync-products error:', res.status, text)
  process.exit(1)
}
console.log(`sync-products: ${rows.length} productos sincronizados.`)
