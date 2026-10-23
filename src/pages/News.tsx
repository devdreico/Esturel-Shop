import { useMemo, useState } from 'react'
import { useNews } from '../hooks/useNews'
import { NewsCard, NewsSkeleton } from '../components/news/NewsCard'
import { Reveal } from '../components/ui/Motion'
import { useSeo } from '../hooks/useSeo'
import { relativeTime } from '../lib/format'

export function NewsPage() {
  const { items, loading, fetchedAt, reload } = useNews()
  const [q, setQ] = useState('')
  const [source, setSource] = useState('all')

  useSeo({
    title: 'Noticias tech',
    description: 'Feed de noticias de tecnología: IA, gadgets, audio y más.',
    path: '/noticias',
  })

  const sources = useMemo(() => {
    const set = new Set(items.map((n) => n.source))
    return [...set]
  }, [items])

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    return items.filter((n) => {
      const matchesSource = source === 'all' || n.source === source
      if (!matchesSource) return false
      if (!t) return true
      return (
        n.title.toLowerCase().includes(t) ||
        n.source.toLowerCase().includes(t) ||
        n.summary.toLowerCase().includes(t)
      )
    })
  }, [items, q, source])

  const updatedLabel = fetchedAt > 0 ? relativeTime(new Date(fetchedAt).toISOString()) : null

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
      <Reveal>
        <p className="text-xs font-bold tracking-widest text-urple-500 uppercase">
          Noticiero tech
        </p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Feed de tecnología</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Noticias en vivo desde feeds RSS (The Verge, TechCrunch, Ars Technica).
        </p>
      </Reveal>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filtrar noticias…"
          className="glass w-full rounded-full px-4 py-2.5 text-sm outline-none focus:border-urple-500/50 sm:w-72"
          aria-label="Filtrar noticias"
        />
        <button
          type="button"
          onClick={() => reload()}
          disabled={loading}
          className="glass w-full shrink-0 rounded-full px-4 py-2.5 text-xs font-bold hover:border-urple-500/40 hover:text-urple-500 disabled:opacity-50 sm:w-auto"
        >
          {loading ? 'Actualizando…' : 'Actualizar feed'}
        </button>
        {!loading && updatedLabel && (
          <span className="text-xs text-muted" aria-live="polite">
            {filtered.length} nota{filtered.length === 1 ? '' : 's'} · Actualizado {updatedLabel}
          </span>
        )}
      </div>

      {sources.length > 1 && (
        <div className="hide-scrollbar -mx-1 mt-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-1">
          {['all', ...sources].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSource(s)}
              className={`shrink-0 snap-start rounded-full px-4 py-2 text-xs font-bold transition ${
                source === s
                  ? 'bg-urple-500 text-white shadow-glow-sm'
                  : 'glass hover:border-urple-500/40'
              }`}
            >
              {s === 'all' ? 'Todas' : s}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading && items.length === 0 ? (
          Array.from({ length: 6 }).map((_, i) => <NewsSkeleton key={i} />)
        ) : filtered.length === 0 ? (
          <div className="glass col-span-full rounded-3xl p-8 text-center sm:p-12">
            <p className="font-bold">Sin resultados</p>
            <p className="mt-1 text-sm text-muted">Prueba otra palabra clave o fuente.</p>
          </div>
        ) : (
          filtered.map((n, i) => <NewsCard key={n.id} item={n} index={i} />)
        )}
      </div>
    </div>
  )
}
