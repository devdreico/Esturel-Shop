import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { formatCOP } from '../lib/format'
import { quoteShipping } from '../lib/shipping'
import { site } from '../config/site'
import { Reveal } from '../components/ui/Motion'
import { CartLineItem } from '../components/cart/CartLineItem'
import { useSeo } from '../hooks/useSeo'

export function CartPage() {
  const { items, subtotal, shipping, grandTotal, count, setQty, removeItem, clearCart } = useCart()
  const quote = quoteShipping(subtotal)

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
          {count} {count === 1 ? 'artículo' : 'artículos'}
        </p>
      </Reveal>

      {items.length === 0 ? (
        <div className="glass mt-10 rounded-3xl p-8 text-center sm:p-12">
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
            {items.map(({ product, variant, qty, lineTotal, key, maxQty, image }) => (
              <li key={key} className="glass-card overflow-hidden rounded-2xl">
                <CartLineItem
                  product={product}
                  variant={variant}
                  qty={qty}
                  lineTotal={lineTotal}
                  lineKey={key}
                  maxQty={maxQty}
                  image={image}
                  onQtyChange={setQty}
                  onRemove={removeItem}
                />
              </li>
            ))}
          </ul>

          <div className="glass-strong mt-6 rounded-2xl p-5">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal</span>
                <span className="font-semibold">{formatCOP(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Envío</span>
                <span className="font-semibold">
                  {shipping === 0 ? 'Gratis' : formatCOP(shipping)}
                </span>
              </div>
              {quote.remainingForFree > 0 && (
                <div className="rounded-xl bg-urple-500/10 px-3 py-2 text-xs text-urple-600 dark:text-urple-300">
                  Te faltan {formatCOP(quote.remainingForFree)} para envío gratis.
                </div>
              )}
              <div className="flex justify-between border-t border-line pt-3 text-base">
                <span className="font-bold">Total estimado</span>
                <span className="font-bold">{formatCOP(grandTotal)}</span>
              </div>
              <p className="text-[11px] text-muted">{site.shipping.note}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={clearCart}
                className="glass rounded-full px-5 py-3 text-sm font-bold hover:text-rose-500"
              >
                Vaciar
              </button>
              <Link to="/checkout" className="btn-primary flex-1 rounded-full px-6 py-3 text-center text-sm">
                {site.cta.cart}
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
