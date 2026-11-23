# Lista de lanzamiento

## Antes de publicar

1. **Productos reales**: reemplaza `content/products.json` (pon `isDemo: false`), sube fotos reales.
2. **Configuración**: completa `content/site.json` o variables de entorno (WhatsApp, correo, NIT, dirección, envío).
3. **Dominio**: confirma `VITE_SITE_URL` y el dominio en Vercel.
4. **Legales**: completa NIT y dirección (variables `VITE_BUSINESS_NIT`, `VITE_BUSINESS_ADDRESS`) y revisa los textos legales.
5. **Pedidos**: decide si usas Supabase (recomendado) o solo Formspree. Configura `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
6. **Analítica**: configura GA4 / Meta Pixel / Umami si habrá pauta.
7. **Imágenes**: OG 1200×630, favicon y manifest ya generados; reemplaza el logo si cambia la marca.

## Verificación

```bash
npm run launch:check
```

Esto ejecuta validación de productos, imágenes, lint, typecheck, tests y build.

## Prueba manual

- Home, catálogo, filtro, búsqueda y orden.
- Ficha de producto con variantes y stock.
- Carrito: cantidades, envío gratis, vaciar.
- Checkout: validación, envío, confirmación, código de pedido.
- WhatsApp fallback cuando falla el envío.
- Enlaces profundos y compartir un producto (preview en WhatsApp/Instagram).
- Móvil real (360 px) y modo oscuro.

## Después del lanzamiento

- Monitorea pedidos en Supabase o correo.
- Revisa Core Web Vitals (LCP < 2.5 s).
- Ajusta tarifas de envío y cobertura según experiencia.
- Activa Sentry cuando haya volumen.
