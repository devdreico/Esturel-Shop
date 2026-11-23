import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const PUBLIC = path.join(ROOT, 'public')
const products = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/products.json'), 'utf8'))

const MAX_BYTES = 300 * 1024
let errors = 0
let warnings = 0

function checkImage(ref, label) {
  if (!ref || typeof ref !== 'string') return
  if (ref.startsWith('http')) return
  const rel = ref.replace(/^\/+/, '')
  const full = path.join(PUBLIC, rel)
  if (!fs.existsSync(full)) {
    console.error(`  ✗ ${label}: no existe ${ref}`)
    errors++
    return
  }
  const size = fs.statSync(full).size
  if (size > MAX_BYTES && !rel.endsWith('.svg')) {
    console.warn(`  ! ${label}: ${ref} pesa ${Math.round(size / 1024)} KB (> ${MAX_BYTES / 1024} KB)`)
    warnings++
  }
}

for (const p of products) {
  checkImage(p.image, `${p.id} image`)
  for (const img of p.images ?? []) checkImage(img, `${p.id} images[]`)
  for (const v of p.variants ?? []) {
    if (v.image) checkImage(v.image, `${p.id}/${v.id} image`)
  }
}

// OG + icons
for (const f of ['og-esturel.png', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'favicon.ico']) {
  if (!fs.existsSync(path.join(PUBLIC, f))) {
    console.error(`  ✗ falta ${f}`)
    errors++
  }
}

console.log(`\nImágenes: ${errors} errores, ${warnings} advertencias.`)
if (errors) process.exit(1)
console.log('OK: imágenes verificadas.')
