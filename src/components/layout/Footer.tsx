import { Link } from 'react-router-dom'

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
            Asesor, tienda y noticiero de tecnología en Colombia. Desde audífonos hasta
            frontera tech, con pagos seguros vía Mercado Pago.
          </p>
          <p className="mt-4 text-xs text-muted">
            Pagos seguros · Efecty · PSE · Nequi · Tarjetas
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
          </ul>
        </div>
        <div>
          <p className="text-xs font-bold tracking-widest text-urple-500 uppercase">Contacto</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>Bogotá, Colombia</li>
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
