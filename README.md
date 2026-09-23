# Esturel Shop

Tienda e-commerce de tecnología en Colombia: **asesor · tienda · noticiero**.

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4 (glassmorphism + autotheme claro/oscuro)
- Framer Motion (microanimaciones, scroll, route transitions)
- React Router
- Mercado Pago (link de pago único por producto)
- Feed RSS externo con fallback local
- Tipografía **Montserrat** (Bold títulos / regular cuerpo)

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

## Mercado Pago

1. Crea un **Link de pago** por producto en [Mercado Pago](https://www.mercadopago.com.co).
2. Pega la URL en `mpPaymentLink` de `src/data/products.ts`.
3. El MVP cobra por link unitario; cantidades multi-unidad requieren Preference API (fase 2).

## Tema

- Auto según `prefers-color-scheme` al cargar.
- Toggle manual persistido en `localStorage` (`esturel-theme`: `system | light | dark`).
