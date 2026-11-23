import { useEffect, useState } from 'react'
import { hasAnalytics, getConsent, setConsent } from '../../lib/analytics'

export function ConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!hasAnalytics()) return
    if (getConsent() === 'unknown') setVisible(true)
    const onConsent = () => setVisible(false)
    window.addEventListener('esturel:consent', onConsent)
    return () => window.removeEventListener('esturel:consent', onConsent)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-line bg-page/95 px-4 py-3 backdrop-blur sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">
          Usamos cookies y métricas para mejorar la tienda. Puedes aceptar o rechazar. Ver{' '}
          <a href="/privacidad" className="font-semibold text-urple-500 hover:underline">
            privacidad
          </a>
          .
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setConsent('denied')}
            className="glass rounded-full px-4 py-2 text-xs font-bold hover:text-urple-500"
          >
            Rechazar
          </button>
          <button
            type="button"
            onClick={() => setConsent('granted')}
            className="btn-primary rounded-full px-4 py-2 text-xs"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}
