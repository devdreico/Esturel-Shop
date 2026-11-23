import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { useSeo } from '../hooks/useSeo'
import { formatCOP } from '../lib/format'
import { createOrder, validateOrder } from '../lib/orders'
import { orderWhatsAppMessage, waUrl, WHATSAPP_DISPLAY } from '../lib/whatsapp'
import { departments, citiesOf } from '../data/colombia'
import { quoteShipping } from '../lib/shipping'
import { site } from '../config/site'
import { Reveal } from '../components/ui/Motion'
import { trackBeginCheckout, trackPurchase } from '../lib/analytics'

type Status = 'idle' | 'sending' | 'error'

export function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [waFallback, setWaFallback] = useState<string | null>(null)

  const [department, setDepartment] = useState('')
  const [city, setCity] = useState('')
  const [consent, setConsent] = useState(false)
  const [honeypot, setHoneypot] = useState('')

  useSeo({
    title: 'Checkout · Contraentrega',
    description: 'Registra tu pedido con pago contraentrega en efectivo. Envíos a todo Colombia.',
    path: '/checkout',
    noindex: true,
  })

  const quote = quoteShipping(subtotal)
  const cities = department ? citiesOf(department) : []

  function buildWaLink(form: FormData) {
    const nombre = String(form.get('nombre') ?? '').trim() || '(sin nombre)'
    const celular = String(form.get('celular') ?? '').trim() || '(sin celular)'
    const direccion = String(form.get('direccion') ?? '').trim() || '(sin dirección)'
    const ciudad = city || String(form.get('ciudad') ?? '').trim() || '(sin ciudad)'
    const dep = department || String(form.get('departamento') ?? '').trim() || '(sin departamento)'
    const notas = String(form.get('notas') ?? '').trim() || undefined
    return waUrl(
      orderWhatsAppMessage({
        nombre,
        celular,
        direccion,
        ciudad,
        departamento: dep,
        notas,
        lines: items.map((l) => ({ name: l.label, qty: l.qty, lineTotal: l.lineTotal })),
        productsTotal: subtotal,
        shipping: quote.shipping,
      }),
    )
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'sending') return
    if (honeypot) return
    const form = e.currentTarget
    const data = new FormData(form)

    const customer = {
      nombre: String(data.get('nombre') ?? '').trim(),
      celular: String(data.get('celular') ?? '').trim(),
      correo: String(data.get('correo') ?? '').trim(),
      departamento: (department || String(data.get('departamento') ?? '').trim()),
      ciudad: (city || String(data.get('ciudad') ?? '').trim()),
      direccion: String(data.get('direccion') ?? '').trim(),
      notas: String(data.get('notas') ?? '').trim(),
    }

    const draft = {
      customer,
      items: items.map((l) => ({ productId: l.product.id, variantId: l.variant?.id, qty: l.qty })),
      notes: customer.notas,
      consent,
    }

    const errors = validateOrder(draft)
    if (Object.keys(errors).length) {
      const first = Object.values(errors)[0] ?? 'Revisa los datos del pedido.'
      setErrorMsg(first)
      setStatus('error')
      setWaFallback(buildWaLink(data))
      return
    }

    setWaFallback(buildWaLink(data))
    setErrorMsg('')
    setStatus('sending')

    trackBeginCheckout(
      items.map((l) => ({ sku: l.product.sku, name: l.label, priceCOP: l.unitPrice, qty: l.qty, category: l.product.category })),
      subtotal,
    )

    try {
      const order = await createOrder(draft)
      clearCart()
      trackPurchase(order, items.map((l) => ({ sku: l.product.sku, name: l.label, priceCOP: l.unitPrice, qty: l.qty })))
      navigate('/pedido/confirmado')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'No pudimos enviar el pedido.')
      setStatus('error')
    }
  }

  if (items.length === 0 && status !== 'sending') {
    return (
      <div className="mx-auto max-w-lg px-4 pt-16 text-center sm:px-6">
        <div className="glass rounded-3xl p-10">
          <h1 className="text-2xl font-bold">Carrito vacío</h1>
          <p className="mt-2 text-sm text-muted">Añade productos antes de registrar tu pedido.</p>
          <Link to="/catalogo" className="btn-primary mt-6 inline-flex rounded-full px-6 py-3 text-sm">
            Ver catálogo
          </Link>
        </div>
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
                  inputMode="tel"
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
              <label className="block text-xs font-semibold text-muted">
                Departamento *
                <select
                  required
                  name="departamento"
                  value={department}
                  onChange={(e) => {
                    setDepartment(e.target.value)
                    setCity('')
                  }}
                  disabled={sending}
                  className="glass mt-1.5 w-full cursor-pointer rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-urple-500/50 disabled:opacity-50"
                >
                  <option value="">Selecciona…</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-xs font-semibold text-muted">
                Ciudad *
                {cities.length > 0 ? (
                  <select
                    required
                    name="ciudad"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={sending}
                    className="glass mt-1.5 w-full cursor-pointer rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-urple-500/50 disabled:opacity-50"
                  >
                    <option value="">Selecciona…</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    required
                    name="ciudad"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={sending}
                    minLength={2}
                    className="glass mt-1.5 w-full rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-urple-500/50 disabled:opacity-50"
                    placeholder="Tu ciudad"
                  />
                )}
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

          <label className="flex items-start gap-3 rounded-2xl bg-surface/60 p-4 text-xs text-muted">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              disabled={sending}
              className="mt-0.5 h-4 w-4 shrink-0 accent-urple-500"
              required
            />
            <span>
              Autorizo el tratamiento de mis datos personales para procesar este pedido, conforme a la{' '}
              <Link to="/privacidad" target="_blank" className="font-semibold text-urple-500 hover:underline">
                Política de privacidad
              </Link>
              .
            </span>
          </label>

          {/* honeypot */}
          <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden>
            <label>
              No rellenar
              <input
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </label>
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
            {sending ? 'Enviando pedido…' : site.cta.checkout}
          </button>

          <p className="text-[11px] leading-relaxed text-muted">
            El pedido llega a nuestro sistema y te contactamos para confirmar. También puedes enviarlo
            directo por WhatsApp al {WHATSAPP_DISPLAY}.
          </p>
        </form>

        <aside className="glass-strong h-fit rounded-2xl p-5 lg:col-span-2">
          <h2 className="text-sm font-bold tracking-widest text-urple-500 uppercase">Resumen</h2>
          <ul className="mt-4 space-y-3">
            {items.map(({ product, variant, qty, lineTotal, image }) => (
              <li key={`${product.id}-${variant?.id ?? ''}`} className="flex items-center gap-3">
                <img
                  src={image}
                  alt=""
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-xl bg-surface object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">
                    {variant ? `${product.name} — ${variant.label}` : product.name}
                  </p>
                  <p className="text-xs text-muted">
                    {qty} × {formatCOP(variant?.priceCOP ?? product.priceCOP)}
                  </p>
                </div>
                <p className="text-sm font-bold">{formatCOP(lineTotal)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-line pt-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Artículos</dt>
              <dd className="font-semibold">{items.reduce((s, i) => s + i.qty, 0)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="font-semibold">{formatCOP(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Envío</dt>
              <dd className="font-semibold">
                {quote.shipping === 0 ? 'Gratis' : formatCOP(quote.shipping)}
              </dd>
            </div>
            <div className="rounded-xl bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-600 dark:text-emerald-400">
              Envío gratis a todo Colombia. Entrega en {site.shipping.estimate}.
            </div>
            <div className="flex justify-between border-t border-line pt-3 text-base">
              <dt className="font-bold">Total a pagar</dt>
              <dd className="font-bold">{formatCOP(quote.total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Forma de pago</dt>
              <dd className="font-semibold text-urple-500">Contraentrega</dd>
            </div>
          </dl>
          <p className="mt-3 text-[11px] text-muted">{site.shipping.note}</p>
        </aside>
      </div>
    </div>
  )
}
