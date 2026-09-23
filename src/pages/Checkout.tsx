import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { formatCOP } from '../lib/format'
import { openCartPayments, openProductPayment, paymentNoteForQty } from '../lib/mercadopago'
import { Reveal } from '../components/ui/Motion'
import { motion } from 'framer-motion'

export function CheckoutPage() {
  const { items, total, count, clearCart } = useCart()
  const [confirmed, setConfirmed] = useState(false)
  const onlyOne = items.length === 1

  if (items.length === 0 && !confirmed) {
    return (
      <div className="mx-auto max-w-lg px-4 pt-16 text-center sm:px-6">
        <div className="glass rounded-3xl p-10">
          <h1 className="text-2xl font-bold">Carrito vacío</h1>
          <p className="mt-2 text-sm text-muted">Añade productos antes de pagar.</p>
          <Link to="/catalogo" className="btn-primary mt-6 inline-flex rounded-full px-6 py-3 text-sm">
            Ver catálogo
          </Link>
        </div>
      </div>
    )
  }

  if (confirmed) {
    return (
      <div className="mx-auto max-w-lg px-4 pt-16 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-3xl p-10 shadow-glow-sm"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-urple-500 text-2xl font-bold text-white">
            ✓
          </div>
          <h1 className="mt-4 text-2xl font-bold">¡Pedido registrado!</h1>
          <p className="mt-2 text-sm text-muted">
            Si el pago en Mercado Pago fue exitoso, te contactaremos al correo o WhatsApp para
            coordinar el envío en Colombia.
          </p>
          <Link to="/catalogo" className="btn-primary mt-6 inline-flex rounded-full px-6 py-3 text-sm">
            Seguir comprando
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
      <Reveal>
        <p className="text-xs font-bold tracking-widest text-urple-500 uppercase">Checkout</p>
        <h1 className="mt-1 text-3xl font-bold">Pagar con Mercado Pago</h1>
        <p className="mt-2 text-sm text-muted">
          Cada producto tiene un <strong>link de pago único</strong> de Mercado Pago. {paymentNoteForQty(1)}
        </p>
      </Reveal>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <div className="space-y-3 lg:col-span-3">
          {items.map(({ product, qty, lineTotal }) => (
            <div key={product.id} className="glass-card flex items-center gap-3 rounded-2xl p-4">
              <img
                src={product.image}
                alt=""
                className="h-14 w-14 rounded-xl bg-surface object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{product.name}</p>
                <p className="text-xs text-muted">
                  {qty} × {formatCOP(product.priceCOP)}
                  {qty > 1 ? ` · link unitario MP` : ''}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{formatCOP(lineTotal)}</p>
                <button
                  type="button"
                  onClick={() => openProductPayment(product)}
                  className="btn-primary mt-2 rounded-full px-4 py-2 text-xs"
                  style={{ transform: 'none' }}
                >
                  Pagar este
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="glass-strong h-fit rounded-2xl p-5 lg:col-span-2">
          <h2 className="text-sm font-bold tracking-widest text-urple-500 uppercase">Resumen</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Artículos</dt>
              <dd className="font-semibold">{count}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Envío</dt>
              <dd className="font-semibold">Se cotiza</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-base">
              <dt className="font-bold">Total</dt>
              <dd className="font-bold">{formatCOP(total)}</dd>
            </div>
          </dl>

          <button
            type="button"
            className="btn-primary mt-5 w-full rounded-full px-5 py-3 text-sm"
            onClick={() => {
              if (onlyOne) openProductPayment(items[0].product)
              else openCartPayments(items.map((i) => ({ product: i.product, qty: i.qty })))
            }}
          >
            {onlyOne ? 'Pagar en Mercado Pago' : 'Abrir links de pago (MP)'}
          </button>

          <button
            type="button"
            className="glass mt-3 w-full rounded-full px-5 py-3 text-sm font-bold hover:border-urple-500/40 hover:text-urple-500"
            onClick={() => {
              clearCart()
              setConfirmed(true)
            }}
          >
            Ya pagué · confirmar pedido
          </button>

          <p className="mt-4 text-[11px] leading-relaxed text-muted">
            El MVP usa links de pago exclusivos por producto (precio fijo). Si llevas más de una
            unidad, indica la cantidad al confirmar o escríbenos para ajustar el cobro.
          </p>
        </aside>
      </div>
    </div>
  )
}
