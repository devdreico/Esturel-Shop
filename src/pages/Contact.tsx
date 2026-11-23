import { Reveal } from '../components/ui/Motion'
import { useSeo } from '../hooks/useSeo'
import { waUrl, WHATSAPP_DISPLAY } from '../lib/whatsapp'
import { site } from '../config/site'
import { trackWhatsApp } from '../lib/analytics'

export function ContactPage() {
  useSeo({
    title: 'Contacto',
    description: 'Canales de contacto de Esturel: WhatsApp, correo e Instagram.',
    path: '/contacto',
  })

  return (
    <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6">
      <Reveal>
        <p className="text-xs font-bold tracking-widest text-urple-500 uppercase">Contacto</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Hablemos</h1>
        <p className="mt-2 text-sm text-muted">
          Estamos disponibles {site.contact.hours}. {site.contact.responseTime}.
        </p>
      </Reveal>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <a
          href={waUrl('Hola Esturel, quiero información.')}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsApp('contact')}
          className="glass-card flex items-center gap-4 rounded-2xl p-5 transition hover:border-urple-500/40"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white">
            <svg viewBox="0 0 32 32" className="h-6 w-6 fill-current" aria-hidden="true">
              <path d="M16.01 3C9.39 3 4 8.28 4 14.77c0 2.07.56 4.08 1.63 5.86L4 29l8.6-2.24a12.3 12.3 0 0 0 3.41.48c6.62 0 12.01-5.28 12.01-11.77C28.02 8.28 22.63 3 16.01 3Z" />
            </svg>
          </span>
          <div>
            <p className="font-bold">WhatsApp</p>
            <p className="text-sm text-muted">{WHATSAPP_DISPLAY}</p>
          </div>
        </a>

        <a
          href={`mailto:${site.contact.email}`}
          className="glass-card flex items-center gap-4 rounded-2xl p-5 transition hover:border-urple-500/40"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-urple-500 text-white">
            @
          </span>
          <div>
            <p className="font-bold">Correo</p>
            <p className="text-sm text-muted">{site.contact.email}</p>
          </div>
        </a>

        <a
          href={site.contact.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-card flex items-center gap-4 rounded-2xl p-5 transition hover:border-urple-500/40"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-urple-500 text-white">
            IG
          </span>
          <div>
            <p className="font-bold">Instagram</p>
            <p className="text-sm text-muted">{site.contact.instagramHandle}</p>
          </div>
        </a>

        <div className="glass-card flex items-center gap-4 rounded-2xl p-5">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface text-2xl">
            📍
          </span>
          <div>
            <p className="font-bold">Ubicación</p>
            <p className="text-sm text-muted">{site.contact.city}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
