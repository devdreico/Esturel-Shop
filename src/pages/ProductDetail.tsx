import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { categoryLabel } from '../data/categories'
import {
  getProductBySlug,
  getRelatedProducts,
  stockStatus,
  unitPrice,
  productImage,
  maxQty,
  getDefaultVariant,
  getVariant,
} from '../data/products'

import { formatCOP } from '../lib/format'
import { useCart } from '../hooks/useCart'
import { ProductCard } from '../components/product/ProductCard'
import { NotFoundPage } from './NotFound'
import { useSeo } from '../hooks/useSeo'
import { breadcrumbJsonLd, productJsonLd } from '../lib/seo'
import { site } from '../config/site'
import { quoteShipping } from '../lib/shipping'
import { waUrl, orderWhatsAppMessage, WHATSAPP_DISPLAY } from '../lib/whatsapp'
import { trackAddToCart, trackViewItem, trackWhatsApp } from '../lib/analytics'
import { Reveal } from '../components/ui/Motion'

export function ProductDetailPage() {
  const { slug } = useParams()
  const product = slug ? getProductBySlug(slug) : undefined
  const { addItem } = useCart()
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 40])

  const [variantId, setVariantId] = useState<string | undefined>(undefined)
  const [qty, setQty] = useState(1)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    if (product?.variants?.length) {
      setVariantId(getDefaultVariant(product)?.id)
    } else {
      setVariantId(undefined)
    }
    setQty(1)
    setActiveImage(0)
  }, [product?.id])

  const variant = product ? getVariant(product, variantId) : undefined
  const status = product ? stockStatus(product, variantId) : 'agotado'
  const price = product ? unitPrice(product, variantId) : 0
  const image = product ? productImage(product, variantId) : ''
  const max = product ? maxQty(product, variantId) : 0
  const available = status !== 'agotado'
  const limit = max > 0 ? max : 99

  useEffect(() => {
    if (product) trackViewItem(product)
  }, [product?.id])

  useSeo(
    product
      ? {
          title: `${product.name} · ${formatCOP(price)}`,
          description: product.shortDesc,
          path: `/producto/${product.slug}`,
          image: image,
          jsonLd: [
            productJsonLd({
              name: product.name,
              description: product.description,
              slug: product.slug,
              priceCOP: price,
              image,
              brand: product.brand,
              sku: variant?.sku ?? product.sku,
              availability: status,
              condition: product.condition,
              warrantyMonths: product.warrantyMonths,
            }),
            breadcrumbJsonLd([
              { name: 'Inicio', path: '/' },
              { name: 'Catálogo', path: '/catalogo' },
              { name: categoryLabel[product.category], path: `/catalogo?cat=${product.category}` },
              { name: product.name, path: `/producto/${product.slug}` },
            ]),
          ],
        }
      : {
          title: 'Producto no encontrado',
          description: 'El producto no existe en el catálogo Esturel.',
          path: `/producto/${slug ?? ''}`,
          noindex: true,
        },
  )

  if (!product) return <NotFoundPage />

  const related = getRelatedProducts(product)
  const gallery = variant?.image && !product.images.includes(variant.image)
    ? [variant.image, ...product.images]
    : product.images

  const handleAdd = () => {
    const ok = addItem(product.id, qty, variantId)
    if (ok) trackAddToCart(product, qty)
    if (ok) navigate('/carrito')
  }

  const handleWhatsApp = () => {
    trackWhatsApp('product')
    const lineTotal = price * qty
    const link = waUrl(
      orderWhatsAppMessage({
        nombre: '',
        celular: '',
        direccion: '',
        ciudad: '',
        departamento: '',
        notas: `Me interesa: ${product.name}${variant ? ` (${variant.label})` : ''} × ${qty}.`,
        lines: [{ name: variant ? `${product.name} — ${variant.label}` : product.name, qty, lineTotal }],
        productsTotal: lineTotal,
        shipping: quoteShipping(lineTotal).shipping,
      }),
    )
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  const handleShare = async () => {
    const url = `${site.brand.url}/producto/${product.slug}`
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, text: product.shortDesc, url })
      } catch {
        /* cancelado */
      }
    } else {
      try {
        await navigator.clipboard.writeText(url)
      } catch {
        /* ignore */
      }
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 pb-28 sm:px-6 sm:pb-12">
      <nav className="text-xs text-muted" aria-label="Miga de pan">
        <Link to="/catalogo" className="hover:text-urple-500">
          Catálogo
        </Link>
        <span className="mx-2">/</span>
        <Link to={`/catalogo?cat=${product.category}`} className="hover:text-urple-500">
          {categoryLabel[product.category]}
        </Link>
        <span className="mx-2">/</span>
        <span>{product.name}</span>
      </nav>

      <div ref={heroRef} className="mt-6 grid gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="glass-strong relative overflow-hidden rounded-3xl"
          >
            <motion.img
              style={{ y: imgY }}
              src={gallery[activeImage] ?? image}
              alt={product.name}
              width={800}
              height={800}
              className="aspect-square w-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-4 left-4 rounded-full bg-urple-500 px-3 py-1 text-xs font-bold text-white shadow-glow-sm">
                {product.badge}
              </span>
            )}
          </motion.div>
          {gallery.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {gallery.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                    activeImage === i ? 'border-urple-500' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`Imagen ${i + 1}`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <Reveal>
            <p className="text-xs font-bold tracking-widest text-urple-500 uppercase">
              {product.brand} · {categoryLabel[product.category]}
            </p>
            <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{product.name}</h1>
            <p className="mt-2 text-sm text-muted">{product.shortDesc}</p>
          </Reveal>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatCOP(price)}</span>
            {product.compareAtCOP && product.compareAtCOP > price && (
              <span className="text-base text-muted line-through">
                {formatCOP(product.compareAtCOP)}
              </span>
            )}
            {product.compareAtCOP && product.compareAtCOP > price && (
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                -{Math.round((1 - price / product.compareAtCOP) * 100)}%
              </span>
            )}
          </div>

          <p className="text-sm">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                status === 'disponible'
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  : status === 'pedido'
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {status === 'disponible' ? 'Disponible' : status === 'pedido' ? 'A pedido' : 'Agotado'}
            </span>
            <span className="ml-3 text-xs text-muted">
              {status === 'disponible'
                ? `Stock: ${max > 0 ? max : 'limitado'}`
                : status === 'pedido'
                  ? 'Entrega en 7–15 días hábiles'
                  : 'Sin stock por ahora'}
            </span>
          </p>

          {product.variants?.length ? (
            <div>
              <p className="text-xs font-bold tracking-widest text-urple-500 uppercase">
                Opciones
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVariantId(v.id)}
                    disabled={v.stock <= 0 && product.stockPolicy !== 'backorder'}
                    className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                      variantId === v.id
                        ? 'border-urple-500 bg-urple-500 text-white'
                        : 'border-line hover:border-urple-500/60'
                    } disabled:cursor-not-allowed disabled:opacity-40`}
                  >
                    {v.label}
                    {v.priceCOP != null && v.priceCOP !== product.priceCOP ? ` · ${formatCOP(v.priceCOP)}` : ''}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold tracking-widest text-urple-500 uppercase">Cantidad</span>
            <div className="glass flex items-center rounded-full">
              <button
                type="button"
                className="px-3 py-1.5 text-sm font-bold hover:text-urple-500 disabled:opacity-40"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                aria-label="Reducir cantidad"
              >
                −
              </button>
              <span className="min-w-8 text-center text-sm font-semibold">{qty}</span>
              <button
                type="button"
                className="px-3 py-1.5 text-sm font-bold hover:text-urple-500 disabled:opacity-40"
                onClick={() => setQty((q) => Math.min(limit, q + 1))}
                disabled={qty >= limit}
                aria-label="Aumentar cantidad"
              >
                +
              </button>
            </div>
            {max > 0 && max <= 5 && (
              <span className="text-xs text-amber-600 dark:text-amber-400">
                Solo {max} disponibles
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleAdd}
              disabled={!available}
              className="btn-primary flex-1 rounded-full px-6 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              {available ? site.cta.product : site.cta.productUnavailable}
            </button>
            <button
              type="button"
              onClick={handleWhatsApp}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
            >
              <svg viewBox="0 0 32 32" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M16.01 3C9.39 3 4 8.28 4 14.77c0 2.07.56 4.08 1.63 5.86L4 29l8.6-2.24a12.3 12.3 0 0 0 3.41.48c6.62 0 12.01-5.28 12.01-11.77C28.02 8.28 22.63 3 16.01 3Zm0 21.5c-1.13 0-2.24-.29-3.22-.85l-.23-.13-5.1 1.33 1.36-4.9-.15-.24a9.2 9.2 0 0 1-1.42-4.94c0-5.14 4.28-9.32 9.55-9.32 5.27 0 9.55 4.18 9.55 9.32 0 5.14-4.28 9.73-9.34 9.73Z" />
              </svg>
              WhatsApp
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="glass rounded-full px-4 py-3 text-sm font-bold hover:text-urple-500"
              aria-label="Compartir producto"
            >
              Compartir
            </button>
          </div>

          <div className="glass rounded-2xl p-4">
            <p className="text-xs font-bold tracking-widest text-urple-500 uppercase">Confianza Esturel</p>
            <ul className="mt-2 space-y-1.5 text-sm text-muted">
              <li>· Pago contraentrega en efectivo al recibir.</li>
              <li>· Garantía de {product.warrantyMonths} meses.</li>
              <li>· Envío {site.shipping.estimate} a {site.shipping.coverage.toLowerCase()}.</li>
              <li>· Retracto de {site.legal.returnsDays} días hábiles (Ley 1480).</li>
              <li>· Soporte por WhatsApp {WHATSAPP_DISPLAY}.</li>
            </ul>
          </div>

          <details className="glass rounded-2xl p-4" open>
            <summary className="cursor-pointer text-sm font-bold">Especificaciones</summary>
            <dl className="mt-3 divide-y divide-line">
              {product.specs.map((s) => (
                <div key={s.label} className="flex justify-between gap-4 py-2 text-sm">
                  <dt className="text-muted">{s.label}</dt>
                  <dd className="text-right font-semibold">{s.value}</dd>
                </div>
              ))}
            </dl>
          </details>

          {product.features?.length ? (
            <div className="glass rounded-2xl p-4">
              <p className="text-xs font-bold tracking-widest text-urple-500 uppercase">Lo que incluye</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {product.features.map((f) => (
                  <li key={f} className="rounded-full bg-surface px-3 py-1 text-xs font-semibold">
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <p className="text-xs text-muted">
            {product.condition === 'nuevo' ? 'Producto nuevo y sellado.' : 'Producto reacondicionado certificado.'}{' '}
            {site.payments.codNote}
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <Reveal>
            <h2 className="text-2xl font-bold">También te puede interesar</h2>
          </Reveal>
          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Barra móvil sticky */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-page/95 px-4 py-3 backdrop-blur sm:hidden">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold">{product.name}</p>
            <p className="text-sm font-bold">{formatCOP(price)}</p>
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!available}
            className="btn-primary rounded-full px-5 py-2.5 text-xs disabled:opacity-40"
          >
            {site.cta.addToCart}
          </button>
        </div>
      </div>
    </div>
  )
}
