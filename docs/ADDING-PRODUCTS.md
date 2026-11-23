# Añadir productos a Esturel

Los productos viven en `content/products.json`. El código los lee, valida y genera las páginas y el sitemap en build.

## Esquema mínimo

```json
{
  "id": "p-13",
  "sku": "EST-MI-PRODUCTO",
  "slug": "mi-producto",
  "name": "Mi Producto",
  "brand": "Marca",
  "category": "audifonos",
  "priceCOP": 299900,
  "image": "/products/mi-producto/01.webp",
  "images": ["/products/mi-producto/01.webp", "/products/mi-producto/02.webp"],
  "shortDesc": "Una línea de venta.",
  "description": "Párrafo descriptivo.",
  "specs": [{ "label": "Batería", "value": "40 h" }],
  "features": ["Bluetooth", "USB-C"],
  "stock": 12,
  "stockPolicy": "deny",
  "condition": "nuevo",
  "warrantyMonths": 12,
  "weightG": 200,
  "badge": "Nuevo",
  "featured": true,
  "tags": ["audio", "bluetooth"],
  "isDemo": false
}
```

## Campos importantes

- `id`: único.
- `slug`: único, minúsculas y guiones (va en la URL).
- `category`: `audifonos | perifericos | frontier | accesorios | streaming`.
- `priceCOP`: entero en pesos COP, sin puntos.
- `stock`: unidades disponibles. `0` + `stockPolicy: "backorder"` = "A pedido".
- `variants`: opcional, para color/almacenamiento. Cada variante tiene `id`, `label`, `sku`, `stock` y `priceCOP` opcional.
- `isDemo`: pon `false` en productos reales. `npm run launch:check` falla si queda algún demo.

## Imágenes

- Sube a `public/products/<slug>/01.webp`, `02.webp`, ...
- Cuadradas ~1200 px, WebP, < 150 KB.
- La primera imagen es la principal y la que se usa para previews sociales.
- Las imágenes `.svg` son solo placeholders de demostración.

## Variantes

```json
"variants": [
  { "id": "128", "label": "128 GB", "sku": "EST-PROD-128", "stock": 5 },
  { "id": "256", "label": "256 GB", "sku": "EST-PROD-256", "stock": 2, "priceCOP": 349900 }
]
```

## Validación

```bash
npm run products:check   # esquema y unicidad
npm run images:check     # archivos referenciados existen y pesan < 300 KB
npm run build            # genera páginas, sitemap y meta por producto
```

## Sincronizar con Supabase (opcional)

```bash
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run products:sync
```
