# Plan de corrección frontend — Esturel Shop

## Problema reportado
La primera pantalla (hero) se corta hacia la derecha y se ve desproporcionada.

## Causas identificadas
1. **Glow decorativo fuera del contenedor**: el div `absolute -right-4 -bottom-4 ... w-full` del carrusel estaba fuera del `overflow-hidden` interno → desbordamiento horizontal.
2. **Sin protección global contra overflow horizontal**: `html`/`body` no tenían `overflow-x: hidden`.
3. **Columnas del hero sin `min-w-0`**: en CSS grid, los hijos pueden no encogerse y provocar overflow con contenido ancho.
4. **Proporciones excesivas**: el carrusel usaba `aspect-[4/3]` en móvil (muy alto) y el título `text-[2.5rem]` desbordaba en pantallas estrechas.

## Correcciones aplicadas
- `overflow-x: hidden` + `max-width: 100%` en `html`/`body`.
- Eliminado el glow desbordante del carrusel.
- `min-w-0` en ambas columnas del hero; gaps ajustados.
- Proporción del carrusel `aspect-[16/10]` con `max-h` 360/420 px.
- Título del hero reducido a `2.25rem` / `4xl` / `5xl`.

## Auditoría de estructuras y sistemas (siguiente iteración)

### Layout y responsive
- [ ] Revisar todos los `overflow-x-auto` (catálogo, noticias, galería) para que no generen scroll horizontal de página.
- [ ] Verificar breakpoints `sm/md/lg` en Header (menú móvil, búsqueda) y Footer (grid 4 col).
- [ ] Probar 320 px, 360 px, 390 px, 768 px, 1024 px, 1440 px.

### Componentes
- [ ] ProductCard: imagen `aspect-square` + `object-cover` (ok). Verificar hover de segunda imagen no desborda.
- [ ] ProductDetail: galería thumbnails `overflow-x-auto` contenido; sticky bar móvil no tapa contenido (padding-bottom).
- [ ] CartDrawer: `max-w-md`, focus trap. Verificar en móvil.
- [ ] Modales/consent banner: z-index y safe-area.

### Animación y performance
- [ ] `prefers-reduced-motion` respetado (ok en la mayoría).
- [ ] Framer Motion `layout` en carrito puede causar jank; medir.
- [ ] LCP del hero: precargar imagen activa (actualmente solo fuentes).
- [ ] Lazy loading de imágenes below-the-fold (ok).

### Accesibilidad
- [ ] Skip link, focus visible, contraste AA en modo claro/oscuro.
- [ ] Formularios con labels y errores anunciados (`aria-live`).
- [ ] Navegación por teclado en carrusel y filtros.

### SEO y previews
- [ ] Prerender genera meta por ruta (ok). Verificar OG en WhatsApp/Instagram.
- [ ] `sitemap.xml` y `robots.txt` con dominio real (ok).

### Estado y datos
- [ ] Carrito persistido y saneado (ok).
- [ ] Pedidos: validación server-side cuando haya Supabase.
- [ ] Idempotencia y reserva de stock.

### Estilos y temas
- [ ] Tokens CSS en `@theme` (ok). Evitar valores mágicos.
- [ ] Modo oscuro: revisar contraste de `glass` y textos muted.

## Acción inmediata
Aplicar correcciones de overflow y proporciones (hecho). Siguiente: auditoría visual en dispositivos reales y ajuste de espaciados.
