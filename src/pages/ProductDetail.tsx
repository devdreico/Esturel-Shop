import { useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Link, useParams } from 'react-router-dom'
import { categoryLabel } from '../data/categories'
import { getProductBySlug, products } from '../data/products'
import { formatCOP } from '../lib/format'
import { useCart } from '../hooks/useCart'
import { openProductPayment, paymentNoteForQty } from '../lib/mercadopago'
import { ProductCard } from '../components/product/ProductCard'
import { NotFoundPage } from './NotFound'

export function ProductDetailPage() {
  const { slug } = useParams()
  const product = slug ? getProductBySlug(slug) : undefined
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const reduce = useReducedMotion()
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const imgY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 40])

  if (!product) return <NotFoundPage />

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)
  const out = product.stockHint === 'agotado'

  return (
    <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6">
      <nav className="text-xs text-muted" aria-label="Miga de pan">
        <Link to="/catalogo" className="hover:text-urple-500">
          Catálogo
        </Link>
        <span className="mx-2">/</span>
        <span>{product.name}</span>
      </nav>

      <div ref={heroRef} className="mt-6 grid gap-8 lg:grid-cols-2">
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="glass-strong overflow-hidden rounded-3xl"
        >
          <motion.img
            style={{ y: imgY }}
            src={product.image}
            alt={product.name}
            className="aspect-square w-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0, 0, 0.2, 1] }}
          className="flex flex-col"
        >
          <p className="text-xs font-bold tracking-widest text-urple-500 uppercase">
            {categoryLabel[product.category]}
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{product.name}</h1>
          <p className="mt-3 text-muted">{product.description}</p>

          <ul className="mt-5 flex flex-wrap gap-2">
            {product.specs.map((s) => (
              <li key={s} className="glass rounded-full px-3 py-1.5 text-xs font-semibold">
                {s}
              </li>
            ))}
          </ul>

          <p className="mt-6 text-3xl font-bold">{formatCOP(product.priceCOP)}</p>
          <p className="mt-1 text-xs text-muted">{paymentNoteForQty(qty)}</p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="glass flex items-center rounded-full">
              <button
                type="button"
                className="px-3 py-2 font-bold hover:text-urple-500"
                onClick={() => setQty((v) => Math.max(1, v - 1))}
                aria-label="Menos"
              >
                −
              </button>
              <span className="min-w-6 text-center text-sm font-bold">{qty}</span>
              <button
                type="button"
                className="px-3 py-2 font-bold hover:text-urple-500"
                onClick={() => setQty((v) => Math.min(99, v + 1))}
                aria-label="Más"
              >
                +
              </button>
            </div>
            <button
              type="button"
              disabled={out}
              onClick={() => addItem(product.id, qty)}
              className="btn-primary rounded-full px-6 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-40"
              style={{ transform: 'none' }}
            >
              Añadir al carrito
            </button>
            <button
              type="button"
              disabled={out}
              onClick={() => openProductPayment(product)}
              className="glass rounded-full px-6 py-3 text-sm font-bold hover:border-urple-500/40 hover:text-urple-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Comprar ahora · MP
            </button>
          </div>

          <p className="mt-4 text-xs text-muted">
            Pago en Mercado Pago · Envíos Colombia · Soporte Esturel
          </p>
        </motion.div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold">También te puede interesar</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
