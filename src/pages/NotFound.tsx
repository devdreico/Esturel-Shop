import { Link } from 'react-router-dom'
import { useSeo } from '../hooks/useSeo'

export function NotFoundPage() {
  useSeo({
    title: 'Página no encontrada',
    description: 'La ruta no existe o el producto fue removido del catálogo.',
    path: '/404',
    noindex: true,
  })

  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="text-xs font-bold tracking-widest text-urple-500 uppercase">404</p>
      <h1 className="mt-2 text-3xl font-bold">Página no encontrada</h1>
      <p className="mt-2 text-sm text-muted">
        La ruta no existe o el producto fue removido del catálogo.
      </p>
      <Link to="/" className="btn-primary mt-6 inline-flex rounded-full px-6 py-3 text-sm">
        Volver al inicio
      </Link>
    </div>
  )
}
