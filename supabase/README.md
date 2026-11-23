# Supabase (opcional, recomendado)

1. Crea un proyecto en Supabase.
2. Ejecuta `supabase/migrations/0001_init.sql` en el SQL editor.
3. Carga productos: `SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run products:sync`.
4. En Vercel, define `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
5. (Opcional) Configura Resend/WhatsApp para notificaciones de pedido.

Sin Supabase, los pedidos se notifican por Formspree y se coordinan por WhatsApp.
