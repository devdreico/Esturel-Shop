import { useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useCart } from '../../hooks/useCart'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { formatCOP } from '../../lib/format'
import { CartBadge } from './CartBadge'
import { CartLineItem } from './CartLineItem'

export function CartDrawer() {
  const { isOpen, closeCart, items, total, count, setQty, removeItem, clearCart } = useCart()
  const reduce = useReducedMotion()
  const panelRef = useRef<HTMLElement | null>(null)

  useFocusTrap(isOpen, panelRef, closeCart)

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
            ref={panelRef}
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
                <h2 className="text-lg font-bold" aria-live="polite">
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
                        className="glass-card overflow-hidden rounded-2xl"
                        style={{ transform: 'none' }}
                      >
                        <CartLineItem
                          product={product}
                          qty={qty}
                          lineTotal={lineTotal}
                          compact
                          onQtyChange={setQty}
                          onRemove={removeItem}
                          onLinkClick={closeCart}
                        />
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-line px-5 py-4 space-y-3">
                <div className="flex items-center justify-between" aria-live="polite">
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
