import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getFeaturedProducts } from '../data/products'
import { useNews } from '../hooks/useNews'
import { formatCOP } from '../lib/format'
import { ProductCard } from '../components/product/ProductCard'
import { NewsCard, NewsSkeleton } from '../components/news/NewsCard'
import { categories } from '../data/categories'
import { Reveal } from '../components/ui/Motion'
import { useCart } from '../hooks/useCart'

export function HomePage() {
  const featured = getFeaturedProducts()
  const { items: news, loading } = useNews()
  const { addItem } = useCart()
  const reduce = useReducedMotion()

  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <motion.p
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-bold tracking-widest text-urple-500 uppercase"
            >
              Asesor · Tienda · Noticiero
            </motion.p>
            <motion.h1
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: [0, 0, 0.2, 1] }}
              className="text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Tecnología con{' '}
              <span className="bg-gradient-to-r from-urple-500 to-urple-400 bg-clip-text text-transparent">
                criterio
              </span>{' '}
              en Colombia
            </motion.h1>
            <motion.p
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="mt-5 max-w-lg text-base text-muted sm:text-lg"
            >
              Desde audífonos hasta frontera tech. Catálogo curado, asesoría real y un feed de
              noticias al día — con pagos seguros por Mercado Pago.
            </motion.p>
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link to="/catalogo" className="btn-primary rounded-full px-6 py-3 text-sm">
                Ver catálogo
              </Link>
              <Link
                to="/noticias"
                className="glass rounded-full px-6 py-3 text-sm font-bold hover:border-urple-500/40 hover:text-urple-500"
              >
                Feed tech
              </Link>
              <Link
                to="/asesor"
                className="glass rounded-full px-6 py-3 text-sm font-bold hover:border-urple-500/40 hover:text-urple-500"
              >
                Hablar con un asesor
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={reduce ? { opacity: 0, scale: 0.96 } : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0, 0, 0.2, 1] }}
            className="relative"
          >
            <div className="glass-strong relative rounded-3xl p-6 sm:p-8">
              <p className="text-xs font-bold tracking-widest text-urple-500 uppercase">
                Destacado de la semana
              </p>
              {featured[0] && (
                <>
                  <h2 className="mt-2 text-2xl font-bold">{featured[0].name}</h2>
                  <p className="mt-2 text-sm text-muted">{featured[0].shortDesc}</p>
                  <div className="mt-4 aspect-video overflow-hidden rounded-2xl bg-surface">
                    <img
                      src={featured[0].image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-xl font-bold">{formatCOP(featured[0].priceCOP)}</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => addItem(featured[0].id)}
                        className="btn-primary rounded-full px-4 py-2 text-xs"
                        style={{ transform: 'none' }}
                      >
                        Añadir
                      </button>
                      <Link
                        to={`/producto/${featured[0].slug}`}
                        className="glass rounded-full px-4 py-2 text-xs font-bold hover:text-urple-500"
                      >
                        Detalle
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="absolute -right-3 -bottom-3 -z-10 h-full w-full rounded-3xl bg-urple-500/25 blur-2xl" />
          </motion.div>
        </div>
      </section>

      {/* Trust */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'Envíos Colombia',
              'Pago Mercado Pago',
              'Asesoría humana',
              'Garantía local',
            ].map((t) => (
              <span key={t} className="glass rounded-full px-4 py-2 text-xs font-semibold">
                {t}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Categorías */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold tracking-widest text-urple-500 uppercase">
                Categorías
              </p>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl">Explora por línea</h2>
            </div>
            <Link to="/catalogo" className="text-sm font-bold text-urple-500 hover:underline">
              Ver todo →
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.05}>
              <Link
                to={`/catalogo?cat=${c.id}`}
                className="glass-card block h-full rounded-2xl p-4 text-center"
              >
                <span className="block text-2xl transition-transform duration-300 hover:scale-110">
                  {c.emoji}
                </span>
                <span className="mt-2 block text-sm font-bold">{c.label}</span>
                <span className="mt-1 block text-xs text-muted">{c.blurb}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Destacados */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold tracking-widest text-urple-500 uppercase">
                Selección Esturel
              </p>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl">Productos destacados</h2>
            </div>
            <Link to="/catalogo" className="text-sm font-bold text-urple-500 hover:underline">
              Catálogo →
            </Link>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.slice(0, 8).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* News preview */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold tracking-widest text-urple-500 uppercase">
                Noticiero tech
              </p>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl">Feed en vivo</h2>
            </div>
            <Link to="/noticias" className="text-sm font-bold text-urple-500 hover:underline">
              Todas →
            </Link>
          </div>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => <NewsSkeleton key={i} />)
            : news.slice(0, 3).map((n, i) => <NewsCard key={n.id} item={n} index={i} />)}
        </div>
      </section>

      {/* CTA Asesor */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="glass-strong relative overflow-hidden rounded-3xl p-8 text-center sm:p-12">
            <div className="absolute -top-20 left-1/2 h-40 w-80 -translate-x-1/2 rounded-full bg-urple-500/30 blur-3xl" />
            <p className="text-xs font-bold tracking-widest text-urple-500 uppercase">
              Asesoría Esturel
            </p>
            <h2 className="mx-auto mt-2 max-w-2xl text-2xl font-bold sm:text-3xl">
              ¿No sabes qué equipo comprar? Te decimos con datos, no con humo.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
              Comparamos specs, presupuesto y uso real en Colombia (envíos, garantías, aranceles).
            </p>
            <Link
              to="/asesor"
              className="btn-primary mt-6 inline-flex rounded-full px-7 py-3 text-sm"
            >
              Solicitar asesoría
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
