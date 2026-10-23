import { useCallback, useEffect, useState } from 'react'
import { fetchTechNews } from '../lib/rss'
import type { NewsItem } from '../data/types'

type NewsState = {
  items: NewsItem[]
  loading: boolean
  ok: boolean
  fetchedAt: number
}

export function useNews() {
  const [state, setState] = useState<NewsState>({
    items: [],
    loading: true,
    ok: true,
    fetchedAt: 0,
  })

  const load = useCallback(async (force: boolean) => {
    setState((s) => ({ ...s, loading: true }))
    const res = await fetchTechNews({ force })
    setState({ items: res.items, loading: false, ok: res.ok, fetchedAt: res.fetchedAt })
  }, [])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const res = await fetchTechNews()
      if (!cancelled) {
        setState({
          items: res.items,
          loading: false,
          ok: res.ok,
          fetchedAt: res.fetchedAt,
        })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const reload = useCallback(() => load(true), [load])

  return { items: state.items, loading: state.loading, ok: state.ok, fetchedAt: state.fetchedAt, reload }
}
