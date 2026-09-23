import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { categories } from '../data/categories'
import { filterProducts } from '../data/products'
import { ProductCard } from '../components/product/ProductCard'
import { Reveal } from '../components/ui/Motion'
import { useSeo } from '../hooks/useSeo'

type Sort = 'relevance' | 'price-asc' | 'price-desc' | 'name'

export function CatalogPage() {
  const [params, setParams] = useSearchParams()
  const category = params.get('cat') ?? 'all'
  const q = params.get('q') ?? ''
  const sort = (params.get('sort') as Sort) || 'relevance'
  const [draft, setDraft] = useState(q)
  const [prevQ, setPrevQ] = useState(q)
  const timerRef = useRef<number | undefined>(undefined)

  useSeo({
    title: 'Catálogo de tecnología',
    description:
      'Audífonos, periféricos y frontera tech con precios en COP y pago seguro por Mercado Pago.',
    path: '/catalogo',
    noindex: Boolean(params.toString()),
  })

  if (prevQ !== q) {
    setPrevQ(q)
    setDraft(q)
  }

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  const products = useMemo(
    () => filterProducts({ category, query: q, sort }),
    [category, q, sort],
  )

  function update(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (!value || value === 'all' || value === 'relevance') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  function onSearch(value: string) {
    setDraft(value)
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => update('q', value), 250)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
      <Reveal>
        <p className="text-xs font-bold tracking-widest text-urple-500 uppercase">Catálogo</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Toda la tecnología Esturel</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Audífonos, periféricos y frontera tech con precios en COP y pago seguro por Mercado
          Pago.
        </p>
      </Reveal>

      <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="hide-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          <button
            type="button"
            onClick={() => update('cat', 'all')}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${
              category === 'all'
                ? 'bg-urple-500 text-white shadow-glow-sm'
                : 'glass hover:border-urple-500/40'
            }`}
          >
            Todas
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => update('cat', c.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition ${
                category === c.id
                  ? 'bg-urple-500 text-white shadow-glow-sm'
                  : 'glass hover:border-urple-500/40'
              }`}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <input
            value={draft}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Buscar…"
            className="glass w-44 rounded-full px-4 py-2 text-sm outline-none focus:border-urple-500/50 sm:w-56"
            aria-label="Buscar en catálogo"
          />
          <select
            value={sort}
            onChange={(e) => update('sort', e.target.value)}
            className="glass cursor-pointer rounded-full px-4 py-2 text-xs font-bold outline-none"
            aria-label="Ordenar"
          >
            <option value="relevance">Relevancia</option>
            <option value="price-asc">Precio ↑</option>
            <option value="price-desc">Precio ↓</option>
            <option value="name">Nombre</option>
          </select>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted" aria-live="polite">
        {products.length} {products.length === 1 ? 'producto' : 'productos'}
        {q ? ` para “${q}”` : ''}
      </p>

      {products.length === 0 ? (
        <div className="glass mt-10 rounded-3xl p-12 text-center">
          <p className="text-lg font-bold">Sin resultados</p>
          <p className="mt-2 text-sm text-muted">Prueba otra categoría o limpia el filtro.</p>
          <button
            type="button"
            onClick={() => setParams(new URLSearchParams(), { replace: true })}
            className="btn-primary mt-5 rounded-full px-5 py-2.5 text-sm"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
