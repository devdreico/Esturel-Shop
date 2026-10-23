import { useEffect } from 'react'
import { useSeo } from '../../hooks/useSeo'
import { Reveal } from './Motion'

/**
 * Redirección hacia un sitio externo asociado (ej. Paceform).
 * Se usa como fallback SPA; el hosting (Netlify _redirects) redirige
 * a nivel servidor cuando está disponible. Muestra una pantalla de
 * tránsito con enlace manual mientras ocurre el replace.
 */
export function ExternalRedirect({
  to,
  label,
  path = '/paceform',
}: {
  to: string
  label: string
  path?: string
}) {
  useEffect(() => {
    window.location.replace(to)
  }, [to])

  useSeo({
    title: label,
    description: `Te llevamos a ${label}, sitio externo de Esturel.`,
    path,
    noindex: true,
  })

  return (
    <div className="mx-auto max-w-lg px-4 pt-16 text-center sm:px-6">
      <Reveal>
        <div className="glass-strong rounded-3xl p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-urple-500 text-2xl font-bold text-white">
            ↗
          </div>
          <h1 className="mt-4 text-2xl font-bold">Abriendo {label}…</h1>
          <p className="mt-2 text-sm text-muted">
            Te llevamos a nuestro sitio asociado de running. Si no se redirige automáticamente,
            usa el botón.
          </p>
          <a
            href={to}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-6 inline-flex rounded-full px-6 py-3 text-sm"
          >
            Continuar en {label}
          </a>
        </div>
      </Reveal>
    </div>
  )
}
