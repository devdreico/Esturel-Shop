import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { formatCOP } from '../../lib/format'
import { CartBadge } from './CartBadge'

export function CartDrawer() {
  const { isOpen, closeCart, items, total, count, setQty, removeItem, clearCart } = useCart()
  const reduce = useReducedMotion()

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Carrito">
          <motion.button
            type="button"
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
            aria-label="Cerrar carrito"
          />
          <motion.aside
            initial={reduce ? { opacity: 0 } : { x: '100%' }}
            animate={reduce ? { opacity: 1 } : { x: 0 }}
            exit={reduce ? { opacity: 0 } : { x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="glass-strong absolute top-0 right-0 flex h-full w-full max-w-md flex-col sm:w-[92%]"
          >
            <header className="flex items-center justify-between border-b border-line px-5 py-4">
              <div>
                <p className="text-xs font-semibold tracking-widest text-urple-500 uppercase">
                  Carrito
                </p>
                <h2 className="text-lg font-bold">
                  {count} {count === 1 ? 'artículo' : 'artículos'}
                </h2>
              </div>
              <CartBadge count={count} onClick={closeCart} />
            </header>

            <div className="flex-1 overflow-y-auto px-4 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
                  <p className="text-muted">Tu carrito está vacío.</p>
                  <Link
                    to="/catalogo"
                    onClick={closeCart}
                    className="btn-primary rounded-full px-5 py-2.5 text-sm"
                  >
                    Ver catálogo
                  </Link>
                </div>
              ) : (
                <ul className="space-y-3">
                  <AnimatePresence initial={false}>
                    {items.map(({ product, qty, lineTotal }) => (
                      <motion.li
                        key={product.id}
                        layout
                        initial={reduce ? { opacity: 0 } : { opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={reduce ? { opacity: 0 } : { opacity: 0, x: 40, height: 0 }}
                        transition={{ duration: 0.22, ease: [0, 0, 0.2, 1] }}
                        className="glass-card flex gap-3 rounded-2xl p-3"
                        style={{ transform: 'none' }}
                      >
                        <Link
                          to={`/producto/${product.slug}`}
                          onClick={closeCart}
                          className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface"
                        >
                          <img
                            src={product.image}
                            alt=""
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </Link>
                        <div className="min-w-0 flex-1">
                          <Link
                            to={`/producto/${product.slug}`}
                            onClick={closeCart}
                            className="block truncate text-sm font-bold hover:text-urple-500"
                          >
                            {product.name}
                          </Link>
                          <p className="text-xs text-muted">{formatCOP(product.priceCOP)}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="glass flex items-center rounded-full">
                              <button
                                type="button"
                                className="px-2.5 py-1 text-sm font-bold hover:text-urple-500"
                                onClick={() => setQty(product.id, qty - 1)}
                                aria-label="Reducir"
                              >
                                −
                              </button>
                              <span className="min-w-5 text-center text-sm font-semibold">
                                {qty}
                              </span>
                              <button
                                type="button"
                                className="px-2.5 py-1 text-sm font-bold hover:text-urple-500"
                                onClick={() => setQty(product.id, qty + 1)}
                                aria-label="Aumentar"
                              >
                                +
                              </button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(product.id)}
                              className="text-xs text-muted underline-offset-2 hover:text-urple-500 hover:underline"
                            >
                              Quitar
                            </button>
                          </div>
                        </div>
                        <p className="text-sm font-bold whitespace-nowrap">{formatCOP(lineTotal)}</p>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-line px-5 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Total</span>
                  <span className="text-xl font-bold">{formatCOP(total)}</span>
                </div>
                <div className="flex gap-2">
                  <Link
                    to="/checkout"
                    onClick={closeCart}
                    className="btn-primary flex-1 rounded-full px-4 py-3 text-center text-sm"
                  >
                    Checkout
                  </Link>
                  <button
                    type="button"
                    onClick={clearCart}
                    className="glass rounded-full px-4 py-3 text-sm font-semibold hover:text-urple-500"
                  >
                    Vaciar
                  </button>
                </div>
              </footer>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
