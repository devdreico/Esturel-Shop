import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { categoryLabel } from '../../data/categories'
import type { Product } from '../../data/types'
import { formatCOP } from '../../lib/format'
import { useCart } from '../../hooks/useCart'

const stockMap = {
  disponible: { label: 'Disponible', cls: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400' },
  pedido: { label: 'A pedido', cls: 'bg-amber-500/15 text-amber-600 dark:text-amber-400' },
  agotado: { label: 'Agotado', cls: 'bg-rose-500/15 text-rose-600 dark:text-rose-400' },
} as const

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addItem } = useCart()
  const reduce = useReducedMotion()
  const stock = product.stockHint ?? 'disponible'

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
            src={product.image}
            alt={product.name}
            width={800}
            height={800}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        </div>
        <span
          className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-bold sm:top-3 sm:left-3 sm:px-2.5 sm:py-1 sm:text-[11px] ${stockMap[stock].cls}`}
        >
          {stockMap[stock].label}
        </span>
        {product.featured && (
          <span className="absolute top-2 right-2 rounded-full bg-urple-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-glow-sm sm:top-3 sm:right-3 sm:px-2.5 sm:py-1 sm:text-[11px]">
            Destacado
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
        <div className="mt-auto pt-2 sm:pt-3">
          <span className="block text-sm font-bold sm:text-lg">{formatCOP(product.priceCOP)}</span>
          <button
            type="button"
            onClick={() => addItem(product.id)}
            disabled={product.stockHint === 'agotado'}
            aria-label={`Añadir ${product.name} al carrito`}
            className="btn-primary mt-1.5 w-full rounded-full px-2.5 py-1.5 text-[11px] disabled:cursor-not-allowed disabled:opacity-40 sm:mt-2 sm:w-auto sm:px-4 sm:py-2 sm:text-xs"
            style={{ transform: 'none' }}
          >
            Añadir
          </button>
        </div>
      </div>
    </motion.article>
  )
}
