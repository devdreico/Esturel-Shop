import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { categoryLabel } from '../../data/categories'
import type { Product } from '../../data/types'
import { formatCOP } from '../../lib/format'
import { useCart } from '../../hooks/useCart'
import { openProductPayment } from '../../lib/mercadopago'

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
      className="glass-card group flex flex-col overflow-hidden rounded-2xl"
    >
      <Link to={`/producto/${product.slug}`} className="relative block overflow-hidden bg-surface/60">
        <div className="aspect-square">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        </div>
        <span
          className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-[11px] font-bold ${stockMap[stock].cls}`}
        >
          {stockMap[stock].label}
        </span>
        {product.featured && (
          <span className="absolute top-3 right-3 rounded-full bg-urple-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-glow-sm">
            Destacado
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-[11px] font-semibold tracking-widest text-urple-500 uppercase">
          {categoryLabel[product.category]}
        </p>
        <Link to={`/producto/${product.slug}`} className="font-bold leading-snug hover:text-urple-500">
          {product.name}
        </Link>
        <p className="line-clamp-2 text-sm text-muted">{product.shortDesc}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="text-lg font-bold">{formatCOP(product.priceCOP)}</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => addItem(product.id)}
              disabled={product.stockHint === 'agotado'}
              className="btn-primary rounded-full px-3 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-40"
              style={{ transform: 'none' }}
            >
              Añadir
            </button>
            <button
              type="button"
              onClick={() => openProductPayment(product)}
              disabled={product.stockHint === 'agotado'}
              className="glass rounded-full px-3 py-2 text-xs font-bold hover:border-urple-500/40 hover:text-urple-500 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Comprar
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
