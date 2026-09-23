import type { Category, ProductCategory } from './types'

export const categories: Category[] = [
  {
    id: 'audifonos',
    label: 'Audífonos',
    blurb: 'ANC, true wireless y estudio',
    emoji: '🎧',
  },
  {
    id: 'perifericos',
    label: 'Periféricos',
    blurb: 'Teclados, mouses y más',
    emoji: '⌨️',
  },
  {
    id: 'frontier',
    label: 'Frontera Tech',
    blurb: 'IA wearables y gadgets',
    emoji: '🛸',
  },
  {
    id: 'accesorios',
    label: 'Accesorios',
    blurb: 'Hubs, cables y energía',
    emoji: '🔌',
  },
  {
    id: 'streaming',
    label: 'Streaming',
    blurb: 'Cámaras y audio pro',
    emoji: '🎬',
  },
]

export const categoryLabel: Record<ProductCategory, string> = Object.fromEntries(
  categories.map((c) => [c.id, c.label]),
) as Record<ProductCategory, string>
