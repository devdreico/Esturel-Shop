import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/products.json'), 'utf8'))
const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/site.json'), 'utf8'))

const VALID_CATEGORIES = new Set(['audifonos', 'perifericos', 'frontier', 'accesorios', 'streaming'])
const VALID_CONDITIONS = new Set(['nuevo', 'reacondicionado'])
const VALID_POLICIES = new Set(['deny', 'backorder'])

const errors = []
const warnings = []

if (!Array.isArray(products) || products.length === 0) {
  errors.push('content/products.json debe ser un array no vacío.')
  process.exit(1)
}

const ids = new Set()
const slugs = new Set()
const skus = new Set()

products.forEach((p, i) => {
  const loc = `producto[${i}] (${p?.id ?? '?'})`
  if (!p || typeof p !== 'object') { errors.push(`${loc}: no es objeto.`); return }
  for (const f of ['id', 'sku', 'slug', 'name', 'brand', 'category', 'priceCOP', 'image', 'shortDesc', 'description']) {
    if (p[f] === undefined || p[f] === null || p[f] === '') errors.push(`${loc}: falta "${f}".`)
  }
  if (typeof p.id !== 'string' || ids.has(p.id)) errors.push(`${loc}: id duplicado o inválido.`)
  else ids.add(p.id)
  if (typeof p.slug !== 'string' || !/^[a-z0-9-]+$/.test(p.slug) || slugs.has(p.slug)) errors.push(`${loc}: slug inválido o duplicado.`)
  else slugs.add(p.slug)
  if (typeof p.sku !== 'string' || skus.has(p.sku)) errors.push(`${loc}: sku inválido o duplicado.`)
  else skus.add(p.sku)
  if (typeof p.priceCOP !== 'number' || !Number.isInteger(p.priceCOP) || p.priceCOP < 0) errors.push(`${loc}: priceCOP debe ser entero >= 0.`)
  if (!VALID_CATEGORIES.has(p.category)) errors.push(`${loc}: categoría inválida "${p.category}".`)
  if (!VALID_CONDITIONS.has(p.condition)) errors.push(`${loc}: condition inválida.`)
  if (!VALID_POLICIES.has(p.stockPolicy)) errors.push(`${loc}: stockPolicy inválida.`)
  if (typeof p.stock !== 'number' || p.stock < 0) errors.push(`${loc}: stock inválido.`)
  if (!Array.isArray(p.images) || p.images.length === 0) warnings.push(`${loc}: sin imágenes; se usará "image".`)
  if (!Array.isArray(p.specs)) warnings.push(`${loc}: specs no es array.`)
  if (p.isDemo) warnings.push(`${loc}: producto de demostración (isDemo=true).`)
  if (p.variants) {
    const vids = new Set()
    for (const v of p.variants) {
      if (!v.id || vids.has(v.id)) errors.push(`${loc}: variante id duplicado/inválido.`)
      vids.add(v.id)
      if (typeof v.stock !== 'number' || v.stock < 0) errors.push(`${loc}: variante ${v.id} stock inválido.`)
      if (v.priceCOP != null && (typeof v.priceCOP !== 'number' || v.priceCOP < 0)) errors.push(`${loc}: variante ${v.id} priceCOP inválido.`)
    }
  }
  if (p.stock === 0 && p.stockPolicy === 'deny') warnings.push(`${loc}: sin stock y política deny (se mostrará Agotado).`)
})

if (products.some((p) => p.isDemo)) {
  warnings.push('Hay productos de demostración. Reemplázalos antes del lanzamiento (npm run launch:check fallará).')
}

console.log(`Validados ${products.length} productos.`)
if (warnings.length) {
  console.log('\nAdvertencias:')
  for (const w of warnings) console.log('  - ' + w)
}
if (errors.length) {
  console.error('\nErrores:')
  for (const e of errors) console.error('  - ' + e)
  process.exit(1)
}
console.log('\nOK: catálogo válido.')
