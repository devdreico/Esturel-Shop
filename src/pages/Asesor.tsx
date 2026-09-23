import { useState } from 'react'
import { Reveal } from '../components/ui/Motion'
import { motion } from 'framer-motion'
import { useSeo } from '../hooks/useSeo'

const topics = [
  'Audífonos / audio',
  'Setup de oficina',
  'Gaming periféricos',
  'Frontera tech / IA',
  'Streaming / creación',
  'Otro',
]

const CONTACT_EMAIL = 'hola@esturel.co'

export function AsesorPage() {
  const [sent, setSent] = useState(false)
  const [topic, setTopic] = useState(topics[0])
  const [honeypot, setHoneypot] = useState('')

  useSeo({
    title: 'Asesoría tecnológica',
    description:
      'Asesoría personalizada de tecnología en Colombia. Comparamos specs, presupuesto y uso real.',
    path: '/asesor',
  })

  if (sent) {
    return (
      <div className="mx-auto max-w-lg px-4 pt-16 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-3xl p-10"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-urple-500 text-2xl font-bold text-white">
            ✓
          </div>
          <h1 className="mt-4 text-2xl font-bold">Abrimos tu correo</h1>
          <p className="mt-2 text-sm text-muted">
            Se preparó el mensaje para {CONTACT_EMAIL}. Si tu cliente de correo no abrió,
            escríbenos directo. Respuesta en horario hábil (Lun–Vie 9:00–18:00 CO).
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="btn-primary mt-6 rounded-full px-6 py-3 text-sm"
          >
            Enviar otra
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
      <Reveal>
        <p className="text-xs font-bold tracking-widest text-urple-500 uppercase">Asesoría</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Habla con un asesor Esturel</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Te ayudamos a elegir según presupuesto, uso y disponibilidad en Colombia — sin
          recomendar hardware que no necesitas.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-6 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-3">
          {[
            {
              t: 'Curaduría real',
              d: 'Solo productos que nosotros compraríamos para el día a día.',
            },
            {
              t: 'Comparativas claras',
              d: 'Specs, precio COP y alternativas si algo no cuadra.',
            },
            {
              t: 'Soporte post-compra',
              d: 'Te acompañamos con garantía y uso del equipo.',
            },
          ].map((c, i) => (
            <Reveal key={c.t} delay={i * 0.06}>
              <div className="glass-card rounded-2xl p-5">
                <h2 className="font-bold">{c.t}</h2>
                <p className="mt-1 text-sm text-muted">{c.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <form
          className="glass-strong relative rounded-3xl p-6 lg:col-span-2"
          onSubmit={(e) => {
            e.preventDefault()
            if (honeypot) return
            const form = e.currentTarget
            const data = new FormData(form)
            const name = String(data.get('name') ?? '')
            const contact = String(data.get('contact') ?? '')
            const message = String(data.get('message') ?? '')
            const subject = encodeURIComponent(`Asesoría Esturel — ${topic}`)
            const body = encodeURIComponent(
              `Nombre: ${name}\nContacto: ${contact}\nTema: ${topic}\n\n${message}`,
            )
            window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
            setSent(true)
          }}
        >
          <h2 className="text-lg font-bold">Solicitar asesoría</h2>
          <p className="mt-1 text-xs text-muted">Abre tu app de correo hacia {CONTACT_EMAIL}.</p>

          <label className="mt-4 block text-xs font-semibold text-muted">
            Nombre
            <input
              required
              name="name"
              autoComplete="name"
              className="glass mt-1.5 w-full rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-urple-500/50"
              placeholder="Tu nombre"
            />
          </label>
          <label className="mt-3 block text-xs font-semibold text-muted">
            WhatsApp o email
            <input
              required
              name="contact"
              autoComplete="tel email"
              className="glass mt-1.5 w-full rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-urple-500/50"
              placeholder="+57 300 000 0000"
            />
          </label>
          <label className="mt-3 block text-xs font-semibold text-muted">
            Tema
            <select
              name="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="glass mt-1.5 w-full cursor-pointer rounded-xl px-4 py-2.5 text-sm text-ink outline-none"
            >
              {topics.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="mt-3 block text-xs font-semibold text-muted">
            Cuéntanos tu caso
            <textarea
              required
              name="message"
              rows={4}
              className="glass mt-1.5 w-full resize-none rounded-xl px-4 py-2.5 text-sm text-ink outline-none focus:border-urple-500/50"
              placeholder="Presupuesto, uso, equipo actual…"
            />
          </label>

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

          <button type="submit" className="btn-primary mt-5 w-full rounded-full px-5 py-3 text-sm">
            Enviar solicitud
          </button>
        </form>
      </div>
    </div>
  )
}
