import { Link } from 'react-router-dom'
import { waUrl, WHATSAPP_DISPLAY } from '../../lib/whatsapp'
import { PACEFORM_URL, PACEFORM_NAME } from '../../lib/partners'
import { INSTAGRAM_URL, INSTAGRAM_HANDLE } from '../../lib/social'
import { site } from '../../config/site'

export function Footer() {
  return (
    <footer className="relative z-10 mt-20 border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <img src={site.brand.logo} alt="" className="h-10 w-10 rounded-lg object-cover" />
            <span className="text-lg font-bold">{site.brand.name.toUpperCase()}</span>
          </div>
          <p className="mt-3 max-w-md text-sm text-muted">
            {site.brand.description}
          </p>
          <p className="mt-4 text-xs text-muted">
            Contraentrega · Envíos a todo Colombia · Coordinamos por WhatsApp
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-semibold text-muted">
            <span className="rounded-full bg-surface px-3 py-1">Pago contraentrega</span>
            <span className="rounded-full bg-surface px-3 py-1">Envío {site.shipping.estimate}</span>
            <span className="rounded-full bg-surface px-3 py-1">Garantía real</span>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold tracking-widest text-urple-500 uppercase">Explorar</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="hover:text-urple-500" to="/catalogo">Catálogo</Link></li>
            {site.features.news && <li><Link className="hover:text-urple-500" to="/noticias">Noticias tech</Link></li>}
            <li><Link className="hover:text-urple-500" to="/carrito">Carrito</Link></li>
            <li><Link className="hover:text-urple-500" to="/asesor">Asesoría</Link></li>
            <li><Link className="hover:text-urple-500" to="/faq">Preguntas frecuentes</Link></li>
            <li>
              <a className="hover:text-urple-500" href={PACEFORM_URL} target="_blank" rel="noopener noreferrer">
                {PACEFORM_NAME} (running) ↗
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold tracking-widest text-urple-500 uppercase">Contacto</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>{site.business.city || site.contact.city}, {site.business.country}</li>
            <li>
              <a
                className="hover:text-urple-500"
                href={waUrl('Hola Esturel, quiero información.')}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp {WHATSAPP_DISPLAY}
              </a>
            </li>
            <li>
              <a className="hover:text-urple-500" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                Instagram {INSTAGRAM_HANDLE} ↗
              </a>
            </li>
            <li>
              <a className="hover:text-urple-500" href={`mailto:${site.contact.email}`}>
                {site.contact.email}
              </a>
            </li>
            <li>{site.contact.hours}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 text-xs text-muted sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} {site.brand.name} · Tecnología con criterio</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link className="hover:text-urple-500" to="/privacidad">Privacidad</Link>
            <Link className="hover:text-urple-500" to="/terminos">Términos</Link>
            <Link className="hover:text-urple-500" to="/envios">Envíos</Link>
            <Link className="hover:text-urple-500" to="/devoluciones">Devoluciones</Link>
            <Link className="hover:text-urple-500" to="/garantia">Garantía</Link>
            <Link className="hover:text-urple-500" to="/contacto">Contacto</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
