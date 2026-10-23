export type HeroSlide = {
  id: string
  src: string
  label: string
  caption: string
  alt: string
}

/**
 * Slides del hero. Fotos de stock con licencia libre (Unsplash)
 * descargadas localmente a public/hero/*.webp.
 */
export const heroSlides: HeroSlide[] = [
  {
    id: 'iphone',
    src: '/hero/iphone.webp',
    label: 'Smartphones',
    caption: 'Últimos lanzamientos',
    alt: 'Smartphone premium en presentación',
  },
  {
    id: 'keyboard',
    src: '/hero/keyboard.webp',
    label: 'Setup gaming',
    caption: 'Teclados y periféricos',
    alt: 'Teclado mecánico con iluminación RGB',
  },
  {
    id: 'headphones',
    src: '/hero/headphones.webp',
    label: 'Audio',
    caption: 'ANC y estudio',
    alt: 'Audífonos over-ear sobre fondo oscuro',
  },
  {
    id: 'gaming',
    src: '/hero/gaming.webp',
    label: 'Gaming',
    caption: 'Consolas y rigs',
    alt: 'Setup gaming con luces de neón',
  },
  {
    id: 'laptop',
    src: '/hero/laptop.webp',
    label: 'Laptops',
    caption: 'Productividad real',
    alt: 'Laptop abierta sobre escritorio minimalista',
  },
  {
    id: 'earbuds',
    src: '/hero/earbuds.webp',
    label: 'Audio TWS',
    caption: 'El día a día',
    alt: 'Audífonos inalámbricos tipo earbuds',
  },
]
