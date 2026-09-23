# Esturel Shop

Tienda e-commerce de tecnología en Colombia: **asesor · tienda · noticiero**.

## Stack

- Vite + React + TypeScript (**strict**)
- Tailwind CSS v4 (glassmorphism + autotheme claro/oscuro)
- Framer Motion (microanimaciones, scroll, route transitions + code splitting)
- React Router · Vitest · oxlint · GitHub Actions CI
- Mercado Pago (link de pago único por producto)
- Feed RSS externo con fallback local + allowlist `https`
- Tipografía **Montserrat** (Bold títulos / regular cuerpo)

## Scripts

```bash
npm install
npm run dev
npm run build
npm run typecheck
npm run lint
npm run test
npm run preview
```

## SEO

- `public/robots.txt` + `public/sitemap.xml`
- Meta/OG/canonical/JSON-LD por ruta (`src/lib/seo.ts`, `useSeo`)
- Manifest + `_headers` / `_redirects` (Netlify)
- Variable `VITE_SITE_URL` (default `https://esturel.shop`)

## Mercado Pago

1. Crea un **Link de pago** por producto en [Mercado Pago](https://www.mercadopago.com.co).
2. Pega la URL en `mpPaymentLink` de `src/data/products.ts`.
3. Links demo se detectan (`isDemoPaymentLink`); producción: Preference API + webhook.

## Tema

- Auto según `prefers-color-scheme` al cargar.
- Toggle manual persistido en `localStorage` (`esturel-theme`: `system | light | dark`).
