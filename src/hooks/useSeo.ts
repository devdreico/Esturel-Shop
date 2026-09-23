import { useEffect } from 'react'
import { applySeo, type SeoInput } from '../lib/seo'

export function useSeo(input: SeoInput): void {
  const { title, description, path, image, noindex, jsonLd } = input
  const key = JSON.stringify({ title, description, path, image, noindex, jsonLd })

  useEffect(() => {
    applySeo({ title, description, path, image, noindex, jsonLd })
    // key ensures re-run when serialized seo changes
  }, [key, title, description, path, image, noindex, jsonLd])
}
