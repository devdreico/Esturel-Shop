import { useParams, Link } from 'react-router-dom'
import { legalPages } from '../content/legal'
import { useSeo } from '../hooks/useSeo'
import { Reveal } from '../components/ui/Motion'
import { site } from '../config/site'

export function LegalPage() {
  const { slug } = useParams()
  const page = legalPages.find((p) => p.slug === slug)

  useSeo({
    title: page?.title ?? 'Información legal',
    description: page?.intro ?? 'Información legal de Esturel.',
    path: `/${slug ?? ''}`,
    noindex: false,
  })

  if (!page) {
    return (
      <div className="mx-auto max-w-3xl px-4 pt-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold">Página no encontrada</h1>
        <Link to="/" className="btn-primary mt-6 inline-flex rounded-full px-6 py-3 text-sm">
          Volver al inicio
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
      <Reveal>
        <p className="text-xs font-bold tracking-widest text-urple-500 uppercase">Legal</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">{page.title}</h1>
        <p className="mt-3 text-sm text-muted">{page.intro}</p>
        <p className="mt-2 text-[11px] text-muted">
          Última actualización: {site.legal.lastUpdated}
        </p>
      </Reveal>

      <div className="mt-8 space-y-8">
        {page.sections.map((s) => (
          <section key={s.heading} className="glass rounded-2xl p-5 sm:p-6">
            <h2 className="text-lg font-bold">{s.heading}</h2>
            <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
              {s.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            {s.bullets?.length ? (
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
                {s.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>

      <div className="mt-8 text-center">
        <Link to="/contacto" className="text-sm font-semibold text-urple-500 hover:underline">
          ¿Dudas? Contáctanos →
        </Link>
      </div>
    </div>
  )
}
