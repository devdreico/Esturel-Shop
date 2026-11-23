import { Link } from 'react-router-dom'
import type { Product, ProductVariant } from '../../data/types'
import { formatCOP } from '../../lib/format'

type Props = {
  product: Product
  variant?: ProductVariant
  qty: number
  lineTotal: number
  lineKey: string
  compact?: boolean
  maxQty?: number
  image?: string
  onQtyChange?: (key: string, qty: number) => void
  onRemove?: (key: string) => void
  linkTo?: string
  onLinkClick?: () => void
}

export function CartLineItem({
  product,
  variant,
  qty,
  lineTotal,
  lineKey,
  compact = false,
  maxQty = 99,
  image,
  onQtyChange,
  onRemove,
  linkTo,
  onLinkClick,
}: Props) {
  const img = image ?? variant?.image ?? product.image
  const name = variant ? `${product.name} · ${variant.label}` : product.name
  const link = linkTo ?? `/producto/${product.slug}`

  return (
    <div className={`flex gap-3 ${compact ? 'p-3' : 'flex-wrap items-center gap-4 p-4'}`}>
      <Link
        to={link}
        onClick={onLinkClick}
        className={`${compact ? 'h-16 w-16' : 'h-16 w-16'} shrink-0 overflow-hidden rounded-xl bg-surface`}
        aria-label={name}
      >
        <img
          src={img}
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
          to={link}
          onClick={onLinkClick}
          className="block truncate text-sm font-bold hover:text-urple-500"
        >
          {name}
        </Link>
        <p className="text-xs text-muted">
          {formatCOP(variant?.priceCOP ?? product.priceCOP)}
          {!compact && qty > 0 ? ` × ${qty}` : ''}
        </p>

        {(onQtyChange || onRemove) && (
          <div className="mt-2 flex items-center gap-2">
            {onQtyChange && (
              <div className="glass flex items-center rounded-full">
                <button
                  type="button"
                  className="px-3 py-1.5 text-sm font-bold hover:text-urple-500 disabled:opacity-40"
                  onClick={() => onQtyChange(lineKey, qty - 1)}
                  disabled={qty <= 1}
                  aria-label={`Reducir cantidad de ${name}`}
                >
                  −
                </button>
                <span className="min-w-5 text-center text-sm font-semibold">{qty}</span>
                <button
                  type="button"
                  className="px-3 py-1.5 text-sm font-bold hover:text-urple-500 disabled:opacity-40"
                  onClick={() => onQtyChange(lineKey, qty + 1)}
                  disabled={qty >= maxQty}
                  aria-label={`Aumentar cantidad de ${name}`}
                >
                  +
                </button>
              </div>
            )}
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(lineKey)}
                className="text-xs text-muted underline-offset-2 hover:text-urple-500 hover:underline"
                aria-label={`Quitar ${name} del carrito`}
              >
                Quitar
              </button>
            )}
          </div>
        )}
      </div>

      <p className={`text-sm font-bold whitespace-nowrap ${compact ? '' : 'w-28 text-right'}`}>
        {formatCOP(lineTotal)}
      </p>
    </div>
  )
}
