import type { NewsItem } from './types'

export const newsFallback: NewsItem[] = [
  {
    id: 'n-fb-1',
    title: 'La IA en dispositivos wearables llega a anillos y auriculares',
    link: 'https://www.theverge.com/ai-artificial-intelligence',
    source: 'The Verge · fallback',
    date: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    summary:
      'Los fabricantes integran modelos ligeros on-device para resúmenes, salud y traducción sin depender de la nube.',
  },
  {
    id: 'n-fb-2',
    title: 'Estándares USB-C: qué cambia para compradores en Latinoamérica',
    link: 'https://arstechnica.com/gadgets/',
    source: 'Ars Technica · fallback',
    date: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    summary:
      'Cargas más rápidas y menos cables: cómo afecta a hubs, power banks y laptops del día a día.',
  },
  {
    id: 'n-fb-3',
    title: 'Audio espacial: ¿ya es hora de actualizar audífonos ANC?',
    link: 'https://techcrunch.com/audio/',
    source: 'TechCrunch · fallback',
    date: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    summary:
      'La nueva generación de cancelación híbrida mejora en trasportes ruidosos y oficinas abiertas.',
  },
  {
    id: 'n-fb-4',
    title: 'Drones sub-250 g: reglas y creatividad para creadores',
    link: 'https://www.theverge.com/drones',
    source: 'The Verge · fallback',
    date: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    summary:
      'Equipos ligeros con 4K y seguimiento activo democratizan el contenido aéreo.',
  },
]
