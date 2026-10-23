import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCart } from '../hooks/useCart'
import { useSeo } from '../hooks/useSeo'
import { formatCOP } from '../lib/format'
import { submitOrder, type OrderPayload } from '../lib/formspree'
import { orderWhatsAppMessage, waUrl, WHATSAPP_DISPLAY } from '../lib/whatsapp'
import { Reveal } from '../components/ui/Motion'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function CheckoutPage() {
  const { items, total, count, clearCart } = useCart()
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [waFallback, setWaFallback] = useState<string | null>(null)
  const [summary, setSummary] = useState<{ lines: string; total: number; count: number } | null>(
    null,
  )

  useSeo({
    title: 'Checkout · Contraentrega',
    description: 'Registra tu pedido con pago contraentrega en efectivo. Envíos a todo Colombia.',
    path: '/checkout',
    noindex: true,
  })

  function buildWaLink(form: FormData) {
    return waUrl(
      orderWhatsAppMessage({
        nombre: String(form.get('nombre') ?? '').trim() || '(sin nombre)',
        celular: String(form.get('celular') ?? '').trim() || '(sin celular)',
        direccion: String(form.get('direccion') ?? '').trim() || '(sin dirección)',
        ciudad: String(form.get('ciudad') ?? '').trim() || '(sin ciudad)',
        departamento: String(form.get('departamento') ?? '').trim() || '(sin departamento)',
        notas: String(form.get('notas') ?? '').trim() || undefined,
        lines: items.map((l) => ({ name: l.product.name, qty: l.qty, lineTotal: l.lineTotal })),
        productsTotal: total,
      }),
    )
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'sending') return
    const form = e.currentTarget
    const data = new FormData(form)
    const resumen = items
      .map((l) => `${l.qty} × ${l.product.name} — ${formatCOP(l.lineTotal)}`)
      .join('\n')
    setSummary({ lines: resumen, total, count })
    setWaFallback(buildWaLink(data))
    setErrorMsg('')
    setStatus('sending')

    const payload: OrderPayload = {
      nombre: String(data.get('nombre') ?? '').trim(),
      celular: String(data.get('celular') ?? '').trim(),
      correo: String(data.get('correo') ?? '').trim(),
      direccion: String(data.get('direccion') ?? '').trim(),
      ciudad: String(data.get('ciudad') ?? '').trim(),
      departamento: String(data.get('departamento') ?? '').trim(),
      notas: String(data.get('notas') ?? '').trim(),
      resumen,
      totalProductos: total,
    }

    try {
      await submitOrder(payload)
      clearCart()
      setStatus('sent')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'No pudimos enviar el pedido.')
      setStatus('error')
    }
  }

  if (items.length === 0 && status !== 'sent') {
    return (
      <div className="mx-auto max-w-lg px-4 pt-16 text-center sm:px-6">
        <div className="glass rounded-3xl p-10">
          <h1 className="text-2xl font-bold">Carrito vacío</h1>
          <p className="mt-2 text-sm text-muted">Añade productos antes de registrar tu pedido.</p>
          <Link
            to="/catalogo"
            className="btn-primary mt-6 inline-flex rounded-full px-6 py-3 text-sm"
          >
            Ver catálogo
          </Link>
        </div>
      </div>
    )
  }

  if (status === 'sent') {
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
          <h1 className="mt-4 text-2xl font-bold">Pedido recibido</h1>
          <p className="mt-2 text-sm text-muted">
            Te contactaremos por WhatsApp o correo para confirmar disponibilidad y cotizar el
            envío. Pagas en <strong>contraentrega</strong> (efectivo) al recibir tu pedido en
            Colombia.
          </p>
          {summary && (
            <div className="glass mt-5 rounded-2xl p-4 text-left">
              <p className="text-xs font-bold tracking-widest text-urple-500 uppercase">Resumen</p>
              <pre className="mt-2 overflow-x-auto text-xs whitespace-pre-wrap text-muted">
                {summary.lines}
              </pre>
              <p className="mt-2 text-sm font-bold">
                Total productos: {formatCOP(summary.total)}
              </p>
            </div>
          )}
          {waFallback && (
            <a
              href={waFallback}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-bold text-white transition-transform duration-200 hover:scale-[1.02]"
            >
              <svg viewBox="0 0 32 32" className="h-5 w-5 fill-current" aria-hidden="true">
                <path d="M16.01 3C9.39 3 4 8.28 4 14.77c0 2.07.56 4.08 1.63 5.86L4 29l8.6-2.24a12.3 12.3 0 0 0 3.41.48c6.62 0 12.01-5.28 12.01-11.77C28.02 8.28 22.63 3 16.01 3Zm0 21.5c-1.13 0-2.24-.29-3.22-.85l-.23-.13-5.1 1.33 1.36-4.9-.15-.24a9.2 9.2 0 0 1-1.42-4.94c0-5.14 4.28-9.32 9.55-9.32 5.27 0 9.55 4.18 9.55 9.32 0 5.14-4.28 9.73-9.34 9.73Z" />
              </svg>
              Coordinar envío por WhatsApp
            </a>
          )}
          <Link
            to="/catalogo"
            className="btn-primary mt-3 inline-flex w-full rounded-full px-6 py-3 text-sm"
          >
            Seguir comprando
          </Link>
        </motion.div>
      </div>
    )
  }

  const sending = status === 'sending'

  return (
    <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
      <Reveal>
        <p className="text-xs font-bold tracking-widest text-urple-500 uppercase">Checkout</p>
        <h1 className="mt-1 text-3xl font-bold">Pedido contraentrega</h1>
        <p className="mt-2 text-sm text-muted">
          Registra tus datos de entrega. Pagas en <strong>efectivo</strong> cuando recibas tu
          pedido. Envíos a todo Colombia (el flete se cotiza contigo).
        </p>
      </Reveal>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        <form onSubmit={onSubmit} className="space-y-4 lg:col-span-3">
          <div className="glass-strong rounded-2xl p-5">
            <h2 className="text-sm font-bold tracking-widest text-urple-500 uppercase">
              Datos de entrega
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block text-xs font-semibold text-muted sm:col-span-2">
                Nombre completo *
                <input
                  required
                  name="nombre"
                  autoComplete="name"
                  minLength={2}
                  disabled={sending}
                  className="glass mt-1.5 w-full rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-urple-500/50 disabled:opacity-50"
                  placeholder="Tu nombre y apellido"
                />
              </label>
              <label className="block text-xs font-semibold text-muted">
                Celular / WhatsApp *
                <input
                  required
                  name="celular"
                  type="tel"
                  autoComplete="tel"
                  minLength={7}
                  disabled={sending}
                  className="glass mt-1.5 w-full rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-urple-500/50 disabled:opacity-50"
                  placeholder="300 000 0000"
                />
              </label>
              <label className="block text-xs font-semibold text-muted">
                Correo (opcional)
                <input
                  name="correo"
                  type="email"
                  autoComplete="email"
                  disabled={sending}
                  className="glass mt-1.5 w-full rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-urple-500/50 disabled:opacity-50"
                  placeholder="tu@correo.com"
                />
              </label>
              <label className="block text-xs font-semibold text-muted sm:col-span-2">
                Dirección de entrega *
                <input
                  required
                  name="direccion"
                  autoComplete="street-address"
                  minLength={5}
                  disabled={sending}
                  className="glass mt-1.5 w-full rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-urple-500/50 disabled:opacity-50"
                  placeholder="Calle, número, apto, barrio"
                />
              </label>
              <label className="block text-xs font-semibold text-muted">
                Ciudad *
                <input
                  required
                  name="ciudad"
                  autoComplete="address-level2"
                  minLength={2}
                  disabled={sending}
                  className="glass mt-1.5 w-full rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-urple-500/50 disabled:opacity-50"
                  placeholder="Bogotá"
                />
              </label>
              <label className="block text-xs font-semibold text-muted">
                Departamento *
                <input
                  required
                  name="departamento"
                  autoComplete="address-level1"
                  minLength={2}
                  disabled={sending}
                  className="glass mt-1.5 w-full rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-urple-500/50 disabled:opacity-50"
                  placeholder="Cundinamarca"
                />
              </label>
              <label className="block text-xs font-semibold text-muted sm:col-span-2">
                Notas (opcional)
                <textarea
                  name="notas"
                  rows={3}
                  disabled={sending}
                  className="glass mt-1.5 w-full resize-none rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-urple-500/50 disabled:opacity-50"
                  placeholder="Indicaciones de entrega, referencias…"
                />
              </label>
            </div>
          </div>

          {errorMsg && (
            <div
              role="alert"
              className="rounded-2xl bg-rose-500/15 px-4 py-3 text-sm text-rose-600 dark:text-rose-400"
            >
              <p className="font-bold">No se pudo enviar el pedido</p>
              <p className="mt-1">{errorMsg}</p>
              {waFallback && (
                <a
                  href={waFallback}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex font-bold underline"
                >
                  Enviar por WhatsApp como alternativa →
                </a>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={sending}
            className="btn-primary w-full rounded-full px-5 py-3 text-sm disabled:cursor-wait disabled:opacity-60"
          >
            {sending ? 'Enviando pedido…' : 'Confirmar pedido contraentrega'}
          </button>

          <p className="text-[11px] leading-relaxed text-muted">
            El pedido llega a nuestro sistema por Formspree y te contactamos para confirmar.
            También puedes enviarlo directo por WhatsApp al {WHATSAPP_DISPLAY}.
          </p>
        </form>

        <aside className="glass-strong h-fit rounded-2xl p-5 lg:col-span-2">
          <h2 className="text-sm font-bold tracking-widest text-urple-500 uppercase">Resumen</h2>
          <ul className="mt-4 space-y-3">
            {items.map(({ product, qty, lineTotal }) => (
              <li key={product.id} className="flex items-center gap-3">
                <img
                  src={product.image}
                  alt=""
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-xl bg-surface object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{product.name}</p>
                  <p className="text-xs text-muted">
                    {qty} × {formatCOP(product.priceCOP)}
                  </p>
                </div>
                <p className="text-sm font-bold">{formatCOP(lineTotal)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-line pt-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Artículos</dt>
              <dd className="font-semibold">{count}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Envío</dt>
              <dd className="font-semibold">Se cotiza</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-base">
              <dt className="font-bold">Total productos</dt>
              <dd className="font-bold">{formatCOP(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Forma de pago</dt>
              <dd className="font-semibold text-urple-500">Contraentrega</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  )
}
