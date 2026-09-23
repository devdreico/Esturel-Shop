import { useCallback, useEffect, useState } from 'react'
import { fetchTechNews } from '../lib/rss'
import type { NewsItem } from '../data/types'

type NewsState = {
  items: NewsItem[]
  loading: boolean
  ok: boolean
}

export function useNews() {
  const [state, setState] = useState<NewsState>({
    items: [],
    loading: true,
    ok: true,
  })

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true }))
    const res = await fetchTechNews()
    setState({ items: res.items, loading: false, ok: res.ok })
  }, [])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const res = await fetchTechNews()
      if (!cancelled) {
        setState({ items: res.items, loading: false, ok: res.ok })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return { items: state.items, loading: state.loading, ok: state.ok, reload: load }
}
