import { Link } from 'react-router-dom'
import type { Product } from '../../data/types'
import { formatCOP } from '../../lib/format'

type Props = {
  product: Product
  qty: number
  lineTotal: number
  compact?: boolean
  onQtyChange?: (productId: string, qty: number) => void
  onRemove?: (productId: string) => void
  linkTo?: string
  onLinkClick?: () => void
}

export function CartLineItem({
  product,
  qty,
  lineTotal,
  compact = false,
  onQtyChange,
  onRemove,
  linkTo,
  onLinkClick,
}: Props) {
  const linkClass = linkTo ? 'cursor-pointer' : ''

  return (
    <div className={`flex gap-3 ${compact ? 'p-3' : 'flex-wrap items-center gap-4 p-4'}`}>
      <Link
        to={linkTo ?? `/producto/${product.slug}`}
        onClick={onLinkClick}
        className={`${compact ? 'h-16 w-16' : 'h-16 w-16'} shrink-0 overflow-hidden rounded-xl bg-surface ${linkClass}`}
        aria-label={product.name}
      >
        <img
          src={product.image}
          alt=""
          width={64}
          height={64}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </Link>

      <div className={compact ? 'min-w-0 flex-1' : 'min-w-0 flex-1'}>
        <Link
          to={linkTo ?? `/producto/${product.slug}`}
          onClick={onLinkClick}
          className="block truncate text-sm font-bold hover:text-urple-500"
        >
          {product.name}
        </Link>
        <p className="text-xs text-muted">
          {formatCOP(product.priceCOP)}
          {!compact && qty > 0 ? ` × ${qty}` : ''}
        </p>

        {(onQtyChange || onRemove) && (
          <div className="mt-2 flex items-center gap-2">
            {onQtyChange && (
              <div className="glass flex items-center rounded-full">
                <button
                  type="button"
                  className="px-2.5 py-1 text-sm font-bold hover:text-urple-500"
                  onClick={() => onQtyChange(product.id, qty - 1)}
                  aria-label={`Reducir cantidad de ${product.name}`}
                >
                  −
                </button>
                <span className="min-w-5 text-center text-sm font-semibold">{qty}</span>
                <button
                  type="button"
                  className="px-2.5 py-1 text-sm font-bold hover:text-urple-500"
                  onClick={() => onQtyChange(product.id, qty + 1)}
                  aria-label={`Aumentar cantidad de ${product.name}`}
                >
                  +
                </button>
              </div>
            )}
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(product.id)}
                className="text-xs text-muted underline-offset-2 hover:text-urple-500 hover:underline"
                aria-label={`Quitar ${product.name} del carrito`}
              >
                Quitar
              </button>
            )}
          </div>
        )}
      </div>

      <p
        className={`text-sm font-bold whitespace-nowrap ${compact ? '' : 'w-28 text-right'}`}
      >
        {formatCOP(lineTotal)}
      </p>
    </div>
  )
}
