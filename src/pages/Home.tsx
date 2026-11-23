import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { getFeaturedProducts, categoryCounts } from '../data/products'
import { useNews } from '../hooks/useNews'
import { formatCOP } from '../lib/format'
import { ProductCard } from '../components/product/ProductCard'
import { NewsCard, NewsSkeleton } from '../components/news/NewsCard'
import { categories } from '../data/categories'
import { Reveal } from '../components/ui/Motion'
import { useSeo } from '../hooks/useSeo'
import { organizationJsonLd, websiteJsonLd } from '../lib/seo'
import { site } from '../config/site'
import { PACEFORM_BLURB, PACEFORM_NAME, PACEFORM_URL } from '../lib/partners'
import { waUrl } from '../lib/whatsapp'
import { HeroCarousel } from '../components/home/HeroCarousel'
import { trackWhatsApp } from '../lib/analytics'

export function HomePage() {
  const featured = getFeaturedProducts(8)
  const { items: news, loading } = useNews()
  const reduce = useReducedMotion()
  const hero = featured[0]
  const counts = categoryCounts()

  useSeo({
    title: site.hero.title + ' ' + site.hero.titleAccent + ' ' + site.hero.titleEnd,
    description: site.brand.description,
    path: '/',
    jsonLd: [organizationJsonLd(), websiteJsonLd()],
  })

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Hero */}
      <section className="relative overflow-hidden pt-2 pb-8 sm:pt-6 sm:pb-12">
        <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-urple-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-urple-400/15 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-14">
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
              {site.hero.eyebrow}
            </motion.p>
            <motion.h1
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05, ease: [0, 0, 0.2, 1] }}
              className="text-[2.25rem] leading-[1.04] font-bold tracking-tight sm:text-4xl lg:text-5xl"
            >
              {site.hero.title}{' '}
              <span className="gradient-text-animated">{site.hero.titleAccent}</span>{' '}
              {site.hero.titleEnd}
            </motion.h1>
            <motion.p
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0, 0, 0.2, 1] }}
              className="mt-4 max-w-xl text-base text-muted sm:text-lg"
            >
              {site.hero.subtitle}
            </motion.p>

            <motion.ul
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="mt-5 flex flex-wrap gap-2"
            >
              {site.hero.bullets.map((b) => (
                <li
                  key={b}
                  className="inline-flex items-center gap-1.5 rounded-full glass px-3 py-1.5 text-xs font-semibold"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-urple-500" />
                  {b}
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0, 0, 0.2, 1] }}
              className="mt-7 flex flex-wrap items-center gap-3"
            >
              <Link to="/catalogo" className="btn-primary rounded-full px-6 py-3 text-sm">
                {site.hero.primaryCta}
              </Link>
              <a
                href={waUrl('Hola Esturel, quiero asesoría para elegir un producto.')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsApp('hero')}
                className="glass rounded-full px-6 py-3 text-sm font-bold hover:text-urple-500"
              >
                {site.hero.secondaryCta}
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-widest text-urple-500 uppercase">Categorías</p>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl">Explora por uso</h2>
            </div>
            <Link to="/catalogo" className="text-sm font-semibold text-urple-500 hover:underline">
              Ver todo →
            </Link>
          </div>
        </Reveal>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
          {categories.map((c, i) => (
            <Reveal key={c.id} delay={i * 0.05}>
              <Link
                to={`/catalogo?cat=${c.id}`}
                className="glass-card group flex h-full flex-col items-start gap-2 rounded-2xl p-4 transition hover:border-urple-500/40"
              >
                <span className="text-2xl">{c.emoji}</span>
                <p className="text-sm font-bold">{c.label}</p>
                <p className="text-xs text-muted">{c.blurb}</p>
                <p className="mt-auto text-[11px] font-semibold text-urple-500">
                  {counts[c.id]} productos
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Cómo comprar */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="glass-strong rounded-3xl p-6 sm:p-10">
            <p className="text-xs font-bold tracking-widest text-urple-500 uppercase">Cómo comprar</p>
            <h2 className="mt-1 text-2xl font-bold sm:text-3xl">En 3 pasos, sin tarjeta</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { n: '01', t: 'Elige', d: 'Arma tu carrito con lo que necesitas.' },
                { n: '02', t: 'Confirma', d: 'Te contactamos por WhatsApp para validar stock y envío.' },
                { n: '03', t: 'Recibe', d: 'Pagas en efectivo contraentrega.' },
              ].map((s) => (
                <div key={s.n} className="glass-card rounded-2xl p-5">
                  <p className="text-2xl font-bold text-urple-500">{s.n}</p>
                  <p className="mt-1 font-bold">{s.t}</p>
                  <p className="mt-1 text-sm text-muted">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* Destacados */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-widest text-urple-500 uppercase">Destacados</p>
              <h2 className="mt-1 text-2xl font-bold sm:text-3xl">Lo más pedido</h2>
            </div>
            <Link to="/catalogo" className="text-sm font-semibold text-urple-500 hover:underline">
              Ver catálogo →
            </Link>
          </div>
        </Reveal>
        <div className="mt-6 grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {/* Paceform */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="glass-card flex flex-col items-start gap-4 rounded-3xl p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div>
              <p className="text-xs font-bold tracking-widest text-urple-500 uppercase">
                Proyecto asociado
              </p>
              <h2 className="mt-1 text-xl font-bold sm:text-2xl">{PACEFORM_NAME}</h2>
              <p className="mt-1 max-w-xl text-sm text-muted">{PACEFORM_BLURB}</p>
            </div>
            <a
              href={PACEFORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary rounded-full px-6 py-3 text-sm"
            >
              Ir a Paceform ↗
            </a>
          </div>
        </Reveal>
      </section>

      {/* Noticias */}
      {site.features.news && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold tracking-widest text-urple-500 uppercase">Noticiero</p>
                <h2 className="mt-1 text-2xl font-bold sm:text-3xl">Tecnología en vivo</h2>
              </div>
              <Link to="/noticias" className="text-sm font-semibold text-urple-500 hover:underline">
                Ver feed →
              </Link>
            </div>
          </Reveal>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <NewsSkeleton key={i} />)
              : news.slice(0, 3).map((n, i) => <NewsCard key={n.id} item={n} index={i} />)}
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
        <Reveal>
          <div className="glass-strong rounded-3xl p-8 text-center sm:p-12">
            <h2 className="text-2xl font-bold sm:text-3xl">¿Dudas para elegir?</h2>
            <p className="mt-2 text-sm text-muted">
              Te asesoramos por WhatsApp según presupuesto y uso real.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/asesor" className="btn-primary rounded-full px-6 py-3 text-sm">
                {site.cta.advisor}
              </Link>
              <a
                href={waUrl('Hola Esturel, quiero información sobre sus productos.')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsApp('home-cta')}
                className="glass rounded-full px-6 py-3 text-sm font-bold hover:text-urple-500"
              >
                {site.cta.whatsapp}
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}
