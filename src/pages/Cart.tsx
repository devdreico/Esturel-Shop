import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { formatCOP } from '../lib/format'
import { Reveal } from '../components/ui/Motion'
import { CartLineItem } from '../components/cart/CartLineItem'
import { useSeo } from '../hooks/useSeo'

export function CartPage() {
  const { items, total, count, setQty, removeItem, clearCart } = useCart()

  useSeo({
    title: 'Carrito',
    description: 'Tu carrito de compras Esturel.',
    path: '/carrito',
    noindex: true,
  })

  return (
    <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6">
      <Reveal>
        <p className="text-xs font-bold tracking-widest text-urple-500 uppercase">Carrito</p>
        <h1 className="mt-1 text-3xl font-bold">Tu pedido</h1>
        <p className="mt-2 text-sm text-muted" aria-live="polite">
          {count} {count === 1 ? 'artículo' : 'artículos'} · Total {formatCOP(total)}
        </p>
      </Reveal>

      {items.length === 0 ? (
        <div className="glass mt-10 rounded-3xl p-12 text-center">
          <p className="text-lg font-bold">No hay productos aún</p>
          <p className="mt-2 text-sm text-muted">Explora el catálogo y arma tu setup.</p>
          <Link
            to="/catalogo"
            className="btn-primary mt-6 inline-flex rounded-full px-6 py-3 text-sm"
          >
            Ir al catálogo
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-8 space-y-3">
            {items.map(({ product, qty, lineTotal }) => (
              <li key={product.id} className="glass-card overflow-hidden rounded-2xl">
                <CartLineItem
                  product={product}
                  qty={qty}
                  lineTotal={lineTotal}
                  onQtyChange={setQty}
                  onRemove={removeItem}
                />
              </li>
            ))}
          </ul>

          <div className="glass-strong mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5">
            <div>
              <p className="text-xs text-muted">Total estimado</p>
              <p className="text-2xl font-bold">{formatCOP(total)}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={clearCart}
                className="glass rounded-full px-5 py-3 text-sm font-bold hover:text-rose-500"
              >
                Vaciar
              </button>
              <Link to="/checkout" className="btn-primary rounded-full px-6 py-3 text-sm">
                Continuar al pago
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
