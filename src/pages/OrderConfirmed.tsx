import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSeo } from '../hooks/useSeo'
import { readLastOrder, clearLastOrder } from '../lib/orders'
import { formatCOP } from '../lib/format'


export function OrderConfirmedPage() {
  const stored = readLastOrder()

  useSeo({
    title: 'Pedido recibido',
    description: 'Tu pedido contraentrega fue recibido. Te contactaremos por WhatsApp.',
    path: '/pedido/confirmado',
    noindex: true,
  })

  // Analítica de compra se registra al confirmar el pedido en checkout.

  if (!stored) {
    return (
      <div className="mx-auto max-w-lg px-4 pt-16 text-center sm:px-6">
        <div className="glass rounded-3xl p-10">
          <h1 className="text-2xl font-bold">Sin pedido reciente</h1>
          <p className="mt-2 text-sm text-muted">Tu último pedido no está disponible.</p>
          <Link to="/catalogo" className="btn-primary mt-6 inline-flex rounded-full px-6 py-3 text-sm">
            Ir al catálogo
          </Link>
        </div>
      </div>
    )
  }

  const { order, lines, whatsappUrl } = stored

  return (
    <div className="mx-auto max-w-lg px-4 pt-16 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-3xl p-8 text-center shadow-glow-sm sm:p-10"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-urple-500 text-2xl font-bold text-white">
          ✓
        </div>
        <h1 className="mt-4 text-2xl font-bold">Pedido recibido</h1>
        <p className="mt-2 text-sm text-muted">
          Código: <span className="font-bold text-ink">{order.code}</span>. Te contactaremos por WhatsApp o correo para confirmar disponibilidad, costo de envío y fecha de entrega. Pagas en <strong>contraentrega</strong> (efectivo) al recibir.
        </p>

        <div className="glass mt-5 rounded-2xl p-4 text-left">
          <p className="text-xs font-bold tracking-widest text-urple-500 uppercase">Resumen</p>
          <ul className="mt-2 space-y-1 text-xs text-muted">
            {lines.map((l, i) => (
              <li key={i} className="flex justify-between gap-2">
                <span className="truncate">{l.qty} × {l.name}</span>
                <span className="font-semibold">{formatCOP(l.lineTotal)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-line pt-2 text-sm font-bold">
            <span>Total productos</span>
            <span>{formatCOP(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-xs text-muted">
            <span>Envío</span>
            <span>{order.shipping === 0 ? 'Gratis' : formatCOP(order.shipping)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold">
            <span>Total a pagar</span>
            <span>{formatCOP(order.total)}</span>
          </div>
          {!order.persisted && (
            <p className="mt-3 text-[11px] text-amber-600 dark:text-amber-400">
              Pedido notificado por correo. Confirmación final por WhatsApp.
            </p>
          )}
        </div>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white transition-transform duration-200 hover:scale-[1.02]"
        >
          Coordinar por WhatsApp
        </a>
        <Link
          to="/catalogo"
          onClick={() => clearLastOrder()}
          className="btn-primary mt-3 inline-flex w-full rounded-full px-6 py-3 text-sm"
        >
          Seguir comprando
        </Link>
      </motion.div>
    </div>
  )
}
