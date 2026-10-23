import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getFeaturedProducts } from '../data/products'
import { useNews } from '../hooks/useNews'
import { formatCOP } from '../lib/format'
import { ProductCard } from '../components/product/ProductCard'
import { NewsCard, NewsSkeleton } from '../components/news/NewsCard'
import { categories } from '../data/categories'
import { Reveal } from '../components/ui/Motion'
import { useSeo } from '../hooks/useSeo'
import { organizationJsonLd } from '../lib/seo'
import { PACEFORM_BLURB, PACEFORM_NAME, PACEFORM_URL } from '../lib/partners'
import { HeroCarousel } from '../components/home/HeroCarousel'

export function HomePage() {
  const featured = getFeaturedProducts()
  const { items: news, loading } = useNews()
  const reduce = useReducedMotion()
  const hero = featured[0]

  useSeo({
    title: 'Esturel · Tecnología en Colombia',
    description:
      'Tienda, asesor y noticiero de tecnología en Colombia. Audífonos, periféricos y frontera tech con pago contraentrega.',
    path: '/',
    jsonLd: organizationJsonLd(),
  })

  return (
    <div className="space-y-16 sm:space-y-20">
      {/* Hero */}
      <section className="relative overflow-hidden pt-4 pb-12 sm:pt-8 sm:pb-16">
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-urple-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-urple-400/15 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14">
          {/* Visual: primero en mobile para impacto */}
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0, 0, 0.2, 1] }}
            className="order-1 lg:order-2"
          >
            <HeroCarousel />
            {hero && (
              <div className="glass mt-4 flex items-center justify-between gap-3 rounded-2xl px-4 py-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-bold tracking-widest text-urple-500 uppercase">
                    Destacado · pago contraentrega
                  </p>
                  <p className="truncate text-sm font-bold">{hero.name}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-sm font-bold">{formatCOP(hero.priceCOP)}</span>
                  <Link
                    to={`/producto/${hero.slug}`}
                    className="btn-primary rounded-full px-3.5 py-1.5 text-xs"
                  >
                    Ver
                  </Link>
                </div>
              </div>
            )}
          </motion.div>

          {/* Copy */}
          <div className="order-2 lg:order-1">
            <motion.p
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full glass px-3 py-1.5 text-xs font-bold tracking-widest text-urple-500 uppercase"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-urple-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-urple-500" />
              </span>
              Asesor · Tienda · Noticiero
            </motion.p>
            <motion.h1
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: [0, 0, 0.2, 1] }}
              className="text-[2.5rem] leading-[1.04] font-bold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Tecnología con{' '}
              <span className="gradient-text-animated">criterio</span> en Colombia
            </motion.h1>
            <motion.p
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="mt-5 max-w-lg text-base text-muted sm:text-lg"
            >
              Desde audífonos hasta frontera tech. Catálogo curado, asesoría real y un feed de
              noticias al día — con pago{' '}
              <strong className="text-ink">contraentrega en efectivo</strong> y envíos a todo
              Colombia.
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
                to="/asesor"
                className="glass rounded-full px-6 py-3 text-sm font-bold hover:border-urple-500/40 hover:text-urple-500"
              >
                Hablar con un asesor
              </Link>
              <Link
                to="/noticias"
                className="glass rounded-full px-6 py-3 text-sm font-bold hover:border-urple-500/40 hover:text-urple-500"
              >
                Feed tech
              </Link>
            </motion.div>
            <motion.ul
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-muted"
            >
              {['Contraentrega', 'Envíos Colombia', 'Soporte por WhatsApp'].map((t) => (
                <li key={t} className="inline-flex items-center gap-1.5">
                  <span className="text-urple-500">✓</span>
                  {t}
                </li>
              ))}
            </motion.ul>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6">
        <Reveal>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'Envíos Colombia',
              'Pago contraentrega',
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
      <section className="mx-auto max-w-7xl px-3 sm:px-6">
        <Reveal>
          <div className="mb-4 flex items-end justify-between sm:mb-6">
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
      <section className="mx-auto max-w-7xl px-3 sm:px-6">
        <Reveal>
          <div className="mb-4 flex items-end justify-between sm:mb-6">
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
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
          {featured.slice(0, 8).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* News preview */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6">
        <Reveal>
          <div className="mb-4 flex items-end justify-between sm:mb-6">
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

      {/* Sitio asociado Paceform */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6">
        <Reveal>
          <a
            href={PACEFORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="glass-strong group flex flex-col items-start justify-between gap-5 rounded-3xl p-6 transition hover:border-urple-500/40 sm:flex-row sm:items-center sm:p-8"
          >
            <div>
              <p className="text-xs font-bold tracking-widest text-urple-500 uppercase">
                Sitio asociado
              </p>
              <h2 className="mt-1 text-2xl font-bold">
                {PACEFORM_NAME} · running con datos
              </h2>
              <p className="mt-2 max-w-xl text-sm text-muted">
                {PACEFORM_BLURB} Planifica tus carreras, registra tus tiempos y analiza tu
                progreso.
              </p>
            </div>
            <span className="btn-primary inline-flex shrink-0 rounded-full px-6 py-3 text-sm">
              Ir a {PACEFORM_NAME} ↗
            </span>
          </a>
        </Reveal>
      </section>

      {/* CTA Asesor */}
      <section className="mx-auto max-w-7xl px-3 sm:px-6">
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
