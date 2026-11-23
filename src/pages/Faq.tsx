import { Reveal } from '../components/ui/Motion'
import { useSeo } from '../hooks/useSeo'
import { faqItems } from '../content/legal'
import { faqJsonLd } from '../lib/seo'
import { site } from '../config/site'

export function FaqPage() {
  useSeo({
    title: 'Preguntas frecuentes',
    description: 'Envíos, pagos contraentrega, devoluciones, garantía y más.',
    path: '/faq',
    jsonLd: faqJsonLd(faqItems),
  })

  return (
    <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
      <Reveal>
        <p className="text-xs font-bold tracking-widest text-urple-500 uppercase">Ayuda</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Preguntas frecuentes</h1>
        <p className="mt-2 text-sm text-muted">
          Todo lo que necesitas saber antes de pedir.
        </p>
      </Reveal>

      <div className="mt-8 space-y-3">
        {faqItems.map((f) => (
          <details key={f.q} className="glass rounded-2xl p-5">
            <summary className="cursor-pointer text-sm font-bold">{f.q}</summary>
            <p className="mt-3 text-sm text-muted">{f.a}</p>
          </details>
        ))}
      </div>

      <div className="glass-strong mt-8 rounded-2xl p-6 text-center">
        <p className="text-sm text-muted">¿No encuentras tu respuesta?</p>
        <a
          href={`mailto:${site.contact.email}`}
          className="mt-3 inline-flex rounded-full px-5 py-2.5 text-sm font-bold text-urple-500 hover:underline"
        >
          Escríbenos
        </a>
      </div>
    </div>
  )
}
