# Esturel Shop

Tienda e-commerce de tecnología en Colombia: **asesor · tienda · noticiero**. Pago **contraentrega** en efectivo, pedidos por WhatsApp y correo.

## Stack

- Vite + React 19 + TypeScript (strict) + Tailwind CSS v4
- Framer Motion · React Router 7 · Vitest · oxlint · GitHub Actions
- Supabase (opcional) para pedidos e inventario · Vercel para deploy

## Desarrollo

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # tsc + vite + prerender + sitemap
npm run typecheck
npm run lint
npm run test
npm run preview
```

## Configurar la tienda (CTAs, contacto, envíos)

Todo lo configurable vive en `content/site.json`. También se puede sobreescribir con variables de entorno (ver `.env.example`).

Campos clave: `contact.whatsappNumber`, `contact.email`, `contact.instagram`, `business.*`, `shipping.flatRateCOP` / `freeFromCOP`, `announcement`, `hero`, `cta`, `integrations.*`.

## Añadir productos

Ver `docs/ADDING-PRODUCTS.md`. Resumen:

1. Edita `content/products.json`.
2. Sube fotos a `public/products/<slug>/01.webp` (cuadradas ~1200 px, WebP < 150 KB).
3. `npm run products:check && npm run images:check`.
4. `npm run build`.

## Lanzamiento

Ver `docs/LAUNCH.md`.

## Supabase (pedidos persistentes)

Ver `supabase/README.md`. Sin Supabase, los pedidos se notifican por Formspree y se coordinan por WhatsApp.

## Estructura

```
content/          # productos y configuración (JSON, editable sin tocar código)
src/
  config/         # site config tipado + env
  data/           # repositorio de productos, categorías, Colombia (DIVIPOLA)
  lib/            # orders, shipping, analytics, seo, storage, rss, ...
  components/     # UI por dominio
  pages/          # rutas
  content/        # textos legales y FAQ
scripts/          # validación, imágenes, prerender, sitemap, sync
api/              # Vercel functions (news)
supabase/         # migraciones SQL
```

## Deploy

Configurado para Vercel (`vercel.json`): rewrites SPA, `cleanUrls`, headers de seguridad (CSP), redirects de redes. Define `VITE_SITE_URL=https://esturel.presentto.online` (o tu dominio) en Vercel.

## Licencia

Privado. © Esturel.
