# Esturel Shop

Tienda e-commerce de tecnología en Colombia: **asesor · tienda · noticiero**.

## Stack

- Vite + React + TypeScript (**strict**)
- Tailwind CSS v4 (glassmorphism + autotheme claro/oscuro)
- Framer Motion (microanimaciones, scroll, route transitions + code splitting)
- React Router · Vitest · oxlint · GitHub Actions CI
- Pago **contraentrega** (efectivo) · Pedidos vía **Formspree** · Coordinación por **WhatsApp**
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

## Pagos contraentrega + pedidos

La tienda no usa pasarelas de pago en línea. El cliente:

1. Añade productos al carrito.
2. En `/checkout` llena nombre, celular, dirección, ciudad y departamento.
3. El pedido se envía a **Formspree** (`src/lib/formspree.ts` → endpoint `FORMSPREE_ENDPOINT`) y llega al correo del dueño del formulario.
4. Se coordina la entrega por **WhatsApp** (`+57 314 457 2008`, `src/lib/whatsapp.ts`). El pago es en efectivo al recibir.

**Formspree:** la primera vez que llegue un pedido, Formspree enviará un correo de activación al dueño de la cuenta. Confírmalo para que los pedidos empiecen a llegar.

## WhatsApp

- Botón flotante en todas las páginas (`WhatsAppFab`, `src/components/ui/WhatsAppFab.tsx`).
- Footer y página de asesoría con enlace directo.
- Número: `+57 314 457 2008` (configurable en `src/lib/whatsapp.ts`).

## Sitio asociado: Paceform (running)

- URL externa: `https://paceform.presentto.online` (`src/lib/partners.ts`).
- Ruta interna de redirección: `/paceform` (SPA) + reglas en `public/_redirects` (Netlify).
- Banner promocional en el home y enlace en el footer.

## Redes sociales

- Instagram: **@esturelco** (`src/lib/social.ts` → `INSTAGRAM_URL`).
- Redirección: `/instagram` y `/ig` → `https://www.instagram.com/esturelco/`.
- Enlace en el footer (Contacto).

## Productos (preparado para inventario real)

- Catálogo en `src/data/products.ts` (TypeScript, sin backend).
- Guía paso a paso en el encabezado del archivo para reemplazar los productos demo por el inventario real.
- Fotos: subir a `public/products/` (cuadradas ~1200px) y referenciar en `image`.
- `stockHint` solo pinta una etiqueta (`disponible | pedido | agotado`).

## SEO

- `public/robots.txt` + `public/sitemap.xml`
- Meta/OG/canonical/JSON-LD por ruta (`src/lib/seo.ts`, `useSeo`)
- Manifest + `_headers` / `_redirects` (Netlify)
- Variable `VITE_SITE_URL` (default `https://esturel.shop`)

## Tema

- Auto según `prefers-color-scheme` al cargar.
- Toggle manual persistido en `localStorage` (`esturel-theme`: `system | light | dark`).
