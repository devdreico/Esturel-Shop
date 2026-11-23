import { Component, type ErrorInfo, type ReactNode } from 'react'
import { site } from '../../config/site'
import { waUrl } from '../../lib/whatsapp'

type State = { hasError: boolean }

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  override state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('Esturel error boundary:', error, info.componentStack)
  }

  override render() {
    if (!this.state.hasError) return this.props.children
    return (
      <div className="mx-auto max-w-lg px-4 pt-24 text-center sm:px-6">
        <div className="glass rounded-3xl p-10">
          <h1 className="text-2xl font-bold">Algo salió mal</h1>
          <p className="mt-2 text-sm text-muted">
            Recarga la página o escríbenos por WhatsApp.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn-primary rounded-full px-6 py-3 text-sm"
            >
              Recargar
            </button>
            <a
              href={waUrl('Hola Esturel, tuve un problema en la tienda.')}
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-full px-6 py-3 text-sm font-bold hover:text-urple-500"
            >
              WhatsApp
            </a>
          </div>
          <p className="mt-4 text-[11px] text-muted">{site.contact.email}</p>
        </div>
      </div>
    )
  }
}
