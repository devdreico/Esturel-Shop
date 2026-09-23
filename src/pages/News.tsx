import { useMemo, useState } from 'react'
import { useNews } from '../hooks/useNews'
import { NewsCard, NewsSkeleton } from '../components/news/NewsCard'
import { Reveal } from '../components/ui/Motion'
import { useSeo } from '../hooks/useSeo'

export function NewsPage() {
  const { items, loading, ok, reload } = useNews()
  const [q, setQ] = useState('')

  useSeo({
    title: 'Noticias tech',
    description: 'Feed de noticias de tecnología: IA, gadgets, audio y más.',
    path: '/noticias',
  })

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return items
    return items.filter(
      (n) =>
        n.title.toLowerCase().includes(t) ||
        n.source.toLowerCase().includes(t) ||
        n.summary.toLowerCase().includes(t),
    )
  }, [items, q])

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
      <Reveal>
        <p className="text-xs font-bold tracking-widest text-urple-500 uppercase">
          Noticiero tech
        </p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Feed de tecnología</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Noticias en vivo desde feeds RSS (The Verge, TechCrunch, Ars Technica) con respaldo local
          si la fuente no responde.
        </p>
        {!ok && !loading && (
          <p className="mt-3 rounded-full bg-amber-500/15 px-3 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 inline-block">
            Mostrando respaldo local — RSS no disponible ahora.
          </p>
        )}
      </Reveal>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filtrar noticias…"
          className="glass w-full max-w-sm rounded-full px-4 py-2.5 text-sm outline-none focus:border-urple-500/50 sm:w-72"
          aria-label="Filtrar noticias"
        />
        <button
          type="button"
          onClick={() => void reload()}
          className="glass rounded-full px-4 py-2.5 text-xs font-bold hover:border-urple-500/40 hover:text-urple-500"
        >
          Actualizar feed
        </button>
        {!loading && (
          <span className="text-xs text-muted">
            {filtered.length} nota{filtered.length === 1 ? '' : 's'}
          </span>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <NewsSkeleton key={i} />)
        ) : filtered.length === 0 ? (
          <div className="glass col-span-full rounded-3xl p-10 text-center">
            <p className="font-bold">Sin resultados</p>
            <p className="mt-1 text-sm text-muted">Prueba otra palabra clave.</p>
          </div>
        ) : (
          filtered.map((n, i) => <NewsCard key={n.id} item={n} index={i} />)
        )}
      </div>
    </div>
  )
}
