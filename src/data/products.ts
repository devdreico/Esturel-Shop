import type { Product } from './types'

/**
 * mpPaymentLink: link de pago único de Mercado Pago por producto.
 * Reemplaza las URLs demo por los Links de pago reales del dashboard MP.
 */
export const products: Product[] = [
  {
    id: 'p-01',
    slug: 'esturel-pulse-anc',
    name: 'Esturel Pulse ANC',
    category: 'audifonos',
    priceCOP: 349900,
    image: '/products/pulse-anc.svg',
    shortDesc: 'Cancelación activa híbrida y 40h de batería.',
    description:
      'Audífonos over-ear con ANC híbrido, drivers de 40 mm y modo transparencia. Pensados para trabajo remoto, viajes y sesiones largas en Colombia.',
    specs: ['ANC híbrido', 'Bluetooth 5.3', '40 h de batería', 'USB-C carga rápida'],
    featured: true,
    mpPaymentLink: 'https://www.mercadopago.com.co/pay/esturel-pulse-anc',
    stockHint: 'disponible',
  },
  {
    id: 'p-02',
    slug: 'esturel-nova-buds',
    name: 'Esturel Nova Buds',
    category: 'audifonos',
    priceCOP: 189900,
    image: '/products/nova-buds.svg',
    shortDesc: 'TWS ligeros con multipoint y IPX5.',
    description:
      'True wireless con sonido balanceado, conexión multipoint a dos dispositivos y resistencia al sudor para el día a día.',
    specs: ['IPX5', 'Multipoint', '28 h con estuche', 'Latencia baja gaming'],
    featured: true,
    mpPaymentLink: 'https://www.mercadopago.com.co/pay/esturel-nova-buds',
    stockHint: 'disponible',
  },
  {
    id: 'p-03',
    slug: 'kestrel-mx-keys',
    name: 'Kestrel MX Keys',
    category: 'perifericos',
    priceCOP: 429900,
    image: '/products/kestrel-mx.svg',
    shortDesc: 'Mecánico hot-swap 75% con RGB suave.',
    description:
      'Teclado mecánico compacto con switches hot-swap, keycaps PBT y perfil bajo para oficina o gaming sin ruido excesivo.',
    specs: ['75% layout', 'Hot-swap', 'USB-C', 'Keycaps PBT'],
    featured: true,
    mpPaymentLink: 'https://www.mercadopago.com.co/pay/kestrel-mx-keys',
    stockHint: 'disponible',
  },
  {
    id: 'p-04',
    slug: 'orbit-pro-mouse',
    name: 'Orbit Pro Mouse',
    category: 'perifericos',
    priceCOP: 259900,
    image: '/products/orbit-pro.svg',
    shortDesc: 'Sensor 26K DPI y 8 botones programables.',
    description:
      'Mouse ergonómico con sensor de alta precisión, switches durables y batería de 70 días. Ideal para diseño y productividad.',
    specs: ['26 000 DPI', '8 botones', '70 días batería', '2.4 GHz + BT'],
    mpPaymentLink: 'https://www.mercadopago.com.co/pay/orbit-pro-mouse',
    stockHint: 'disponible',
  },
  {
    id: 'p-05',
    slug: 'aether-ring-ai',
    name: 'Aether Ring AI',
    category: 'frontier',
    priceCOP: 899900,
    image: '/products/aether-ring.svg',
    shortDesc: 'Anillo inteligente con métricas de sueño y IA.',
    description:
      'Wearable de frontera: seguimiento de sueño, HRV y resúmenes diarios generados con IA en la app companion.',
    specs: ['Sueño y HRV', '7 días batería', 'Titanio', 'App con IA'],
    featured: true,
    mpPaymentLink: 'https://www.mercadopago.com.co/pay/aether-ring-ai',
    stockHint: 'pedido',
  },
  {
    id: 'p-06',
    slug: 'lumen-cam-4k',
    name: 'Lumen Cam 4K',
    category: 'streaming',
    priceCOP: 519900,
    image: '/products/lumen-cam.svg',
    shortDesc: 'Webcam 4K con AI framing y doble micrófono.',
    description:
      'Cámara para stream y reuniones con enfoque automático, corrección de luz y micrófonos duales con reducción de ruido.',
    specs: ['4K30 / 1080p60', 'AI framing', 'USB-C', 'Mic duales'],
    featured: true,
    mpPaymentLink: 'https://www.mercadopago.com.co/pay/lumen-cam-4k',
    stockHint: 'disponible',
  },
  {
    id: 'p-07',
    slug: 'vanta-hub-9in1',
    name: 'Vanta Hub 9 en 1',
    category: 'accesorios',
    priceCOP: 219900,
    image: '/products/vanta-hub.svg',
    shortDesc: 'Hub USB-C con HDMI 4K y PD 100W.',
    description:
      'Hub aluminio para laptops: HDMI, SD, USB 3.0, ethernet y carga passthrough de 100W en un solo cable.',
    specs: ['HDMI 4K60', 'PD 100W', 'Gigabit LAN', 'Aluminio'],
    mpPaymentLink: 'https://www.mercadopago.com.co/pay/vanta-hub-9in1',
    stockHint: 'disponible',
  },
  {
    id: 'p-08',
    slug: 'echo-bar-mini',
    name: 'Echo Bar Mini',
    category: 'audifonos',
    priceCOP: 279900,
    image: '/products/echo-bar.svg',
    shortDesc: 'Barra de sonido USB con DSP para escritorio.',
    description:
      'Barra compacta bajo monitor con Bluetooth, entrada aux y ecualizador por software. Audio claro sin ocupar el escritorio.',
    specs: ['Bluetooth 5.2', 'USB + AUX', 'DSP 5 bandas', 'RGB subtle'],
    mpPaymentLink: 'https://www.mercadopago.com.co/pay/echo-bar-mini',
    stockHint: 'disponible',
  },
  {
    id: 'p-09',
    slug: 'prism-keylight',
    name: 'Prism Key Light',
    category: 'streaming',
    priceCOP: 389900,
    image: '/products/prism-keylight.svg',
    shortDesc: 'Panel de luz bicolor 256 LEDs app-control.',
    description:
      'Iluminación de clave para streams y videollamadas con temperatura bicolor, app móvil y brazo incluido.',
    specs: ['256 LEDs', '2800–6500K', 'App control', 'Brazo incluido'],
    mpPaymentLink: 'https://www.mercadopago.com.co/pay/prism-keylight',
    stockHint: 'disponible',
  },
  {
    id: 'p-10',
    slug: 'drift-drone-mini',
    name: 'Drift Drone Mini',
    category: 'frontier',
    priceCOP: 1599900,
    image: '/products/drift-drone.svg',
    shortDesc: 'Drone sub-250g con cámara 4K y obstáculos.',
    description:
      'Drone plegable ultraligero para creadores: estabilización de 3 eje, seguimiento activo y hasta 31 min de vuelo.',
    specs: ['<250 g', '4K HDR', '31 min vuelo', 'OBSTACLES'],
    mpPaymentLink: 'https://www.mercadopago.com.co/pay/drift-drone-mini',
    stockHint: 'pedido',
  },
  {
    id: 'p-11',
    slug: 'flux-power-100',
    name: 'Flux Power 100W',
    category: 'accesorios',
    priceCOP: 319900,
    image: '/products/flux-power.svg',
    shortDesc: 'Power bank GaN 20 000 mAh con 100W PD.',
    description:
      'Batería externa capaz de cargar laptop, phone y earbuds a la vez. Indicador OLED y carcasa ignífuga.',
    specs: ['20 000 mAh', '100W PD', '3 puertos', 'OLED'],
    mpPaymentLink: 'https://www.mercadopago.com.co/pay/flux-power-100',
    stockHint: 'disponible',
  },
  {
    id: 'p-12',
    slug: 'nova-track-pad',
    name: 'Nova Track Pad',
    category: 'perifericos',
    priceCOP: 299900,
    image: '/products/nova-trackpad.svg',
    shortDesc: 'Trackpad háptico multi-touch con gestos.',
    description:
      'Superficie háptica con gestos de sistema, conexión dual y batería de 4 meses para setups minimalistas.',
    specs: ['Háptico', 'Dual BT/2.4', '4 meses batería', 'Gestos OS'],
    mpPaymentLink: 'https://www.mercadopago.com.co/pay/nova-track-pad',
    stockHint: 'agotado',
  },
]

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured)
}

export function filterProducts(opts: {
  category?: string
  query?: string
  sort?: 'relevance' | 'price-asc' | 'price-desc' | 'name'
}): Product[] {
  let list = [...products]
  if (opts.category && opts.category !== 'all') {
    list = list.filter((p) => p.category === opts.category)
  }
  const q = (opts.query ?? '').trim().toLowerCase()
  if (q) {
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.specs.some((s) => s.toLowerCase().includes(q)),
    )
  }
  switch (opts.sort) {
    case 'price-asc':
      list.sort((a, b) => a.priceCOP - b.priceCOP)
      break
    case 'price-desc':
      list.sort((a, b) => b.priceCOP - a.priceCOP)
      break
    case 'name':
      list.sort((a, b) => a.name.localeCompare(b.name, 'es'))
      break
    default:
      break
  }
  return list
}
