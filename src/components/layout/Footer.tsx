import { Link } from 'react-router-dom'
import { waUrl, WHATSAPP_DISPLAY } from '../../lib/whatsapp'
import { PACEFORM_URL } from '../../lib/partners'
import { INSTAGRAM_URL } from '../../lib/social'

export function Footer() {
  return (
    <footer className="relative z-10 mt-20 border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <img src="/esturel-logo.png" alt="" className="h-10 w-10 rounded-lg" />
            <span className="text-lg font-bold">ESTUREL</span>
          </div>
          <p className="mt-3 max-w-md text-sm text-muted">
            Asesor, tienda y noticiero de tecnología en Colombia. Desde audífonos hasta frontera
            tech, con pago contraentrega en efectivo.
          </p>
          <p className="mt-4 text-xs text-muted">
            Contraentrega · Envíos a todo Colombia · Coordinamos por WhatsApp
          </p>
        </div>
        <div>
          <p className="text-xs font-bold tracking-widest text-urple-500 uppercase">Explorar</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link className="hover:text-urple-500" to="/catalogo">
                Catálogo
              </Link>
            </li>
            <li>
              <Link className="hover:text-urple-500" to="/noticias">
                Noticias tech
              </Link>
            </li>
            <li>
              <Link className="hover:text-urple-500" to="/carrito">
                Carrito
              </Link>
            </li>
            <li>
              <Link className="hover:text-urple-500" to="/asesor">
                Asesoría
              </Link>
            </li>
            <li>
              <a
                className="hover:text-urple-500"
                href={PACEFORM_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Paceform (running) ↗
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold tracking-widest text-urple-500 uppercase">Contacto</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>Bogotá, Colombia</li>
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
              <a
                className="hover:text-urple-500"
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram @esturelco ↗
              </a>
            </li>
            <li>
              <a className="hover:text-urple-500" href="mailto:hola@esturel.co">
                hola@esturel.co
              </a>
            </li>
            <li>Lun–Vie 9:00–18:00</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} Esturel · Tecnología con criterio
      </div>
    </footer>
  )
}
