import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { categoryLabel } from '../../data/categories'
import type { Product } from '../../data/types'
import { stockStatus, unitPrice, productImage, maxQty } from '../../data/products'
import { formatCOP } from '../../lib/format'
import { useCart } from '../../hooks/useCart'
import { trackAddToCart } from '../../lib/analytics'
import { site } from '../../config/site'

const stockMap = {
  disponible: { label: 'Disponible', cls: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
  pedido: { label: 'A pedido', cls: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' },
  agotado: { label: 'Agotado', cls: 'bg-rose-500/15 text-rose-600 dark:text-rose-400' },
} as const

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addItem } = useCart()
  const reduce = useReducedMotion()
  const status = stockStatus(product)
  const price = unitPrice(product)
  const image = productImage(product)
  const secondImage = product.images[1]
  const hasVariants = Boolean(product.variants?.length)
  const available = maxQty(product) > 0 || product.stockPolicy === 'backorder'

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const ok = addItem(product.id, 1)
    if (ok) trackAddToCart(product, 1)
  }

  return (
    <motion.article
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 28 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{
        duration: reduce ? 0.15 : 0.45,
        delay: reduce ? 0 : Math.min(index * 0.05, 0.4),
        ease: [0, 0, 0.2, 1],
      }}
      whileHover={reduce ? undefined : { y: -4 }}
      className="glass-card group flex h-full flex-col overflow-hidden rounded-2xl"
    >
      <Link to={`/producto/${product.slug}`} className="relative block overflow-hidden bg-surface/60">
        <div className="aspect-square">
          <img
            src={image}
            alt={product.name}
            width={600}
            height={600}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
          {secondImage && (
            <img
              src={secondImage}
              alt=""
              aria-hidden="true"
              width={600}
              height={600}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
        </div>
        <span
          className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-bold sm:top-3 sm:left-3 sm:px-2.5 sm:py-1 sm:text-[11px] ${stockMap[status].cls}`}
        >
          {stockMap[status].label}
        </span>
        {product.badge && (
          <span className="absolute top-2 right-2 rounded-full bg-urple-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-glow-sm sm:top-3 sm:right-3 sm:px-2.5 sm:py-1 sm:text-[11px]">
            {product.badge}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-2.5 sm:gap-2 sm:p-4">
        <p className="text-[10px] font-semibold tracking-widest text-urple-500 uppercase sm:text-[11px]">
          {categoryLabel[product.category]}
        </p>
        <Link
          to={`/producto/${product.slug}`}
          className="mt-0.5 line-clamp-2 text-[13px] leading-snug font-bold hover:text-urple-500 sm:mt-0 sm:text-base"
        >
          {product.name}
        </Link>
        <p className="mt-1 hidden line-clamp-2 text-sm text-muted sm:mt-0 sm:block">
          {product.shortDesc}
        </p>
        {hasVariants && (
          <p className="mt-1 text-[10px] text-muted sm:text-[11px]">
            {product.variants!.length} opciones
          </p>
        )}
        <div className="mt-auto pt-2 sm:pt-3">
          <div className="flex items-baseline gap-2">
            <span className="block text-sm font-bold sm:text-lg">{formatCOP(price)}</span>
            {product.compareAtCOP && product.compareAtCOP > price && (
              <span className="text-xs text-muted line-through">
                {formatCOP(product.compareAtCOP)}
              </span>
            )}
          </div>
          {hasVariants ? (
            <Link
              to={`/producto/${product.slug}`}
              className="btn-primary mt-1.5 w-full rounded-full px-2.5 py-1.5 text-center text-[11px] sm:mt-2 sm:w-auto sm:px-4 sm:py-2 sm:text-xs"
            >
              {site.cta.viewProduct}
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleAdd}
              disabled={!available}
              aria-label={`${site.cta.addToCart} ${product.name}`}
              className="btn-primary mt-1.5 w-full rounded-full px-2.5 py-1.5 text-[11px] disabled:cursor-not-allowed disabled:opacity-40 sm:mt-2 sm:w-auto sm:px-4 sm:py-2 sm:text-xs"
            >
              {site.cta.addToCart}
            </button>
          )}
        </div>
      </div>
    </motion.article>
  )
}
