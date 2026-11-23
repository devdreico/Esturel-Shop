-- Esturel Shop: esquema inicial de catálogo y pedidos (contraentrega)
-- Ejecutar en Supabase SQL editor o via `supabase db push`.

create sequence if not exists public.order_code_seq start 1;

create table if not exists public.products (
  id text primary key,
  sku text not null unique,
  slug text not null unique,
  name text not null,
  brand text not null default '',
  category text not null,
  price_cop integer not null check (price_cop >= 0),
  compare_at_cop integer,
  image text not null,
  images text[] not null default '{}',
  short_desc text not null default '',
  description text not null default '',
  specs jsonb not null default '[]'::jsonb,
  features text[] not null default '{}',
  variants jsonb not null default '[]'::jsonb,
  stock integer not null default 0 check (stock >= 0),
  reserved integer not null default 0 check (reserved >= 0),
  stock_policy text not null default 'deny' check (stock_policy in ('deny','backorder')),
  condition text not null default 'nuevo',
  warranty_months integer not null default 6,
  weight_g integer,
  dimensions_cm text,
  badge text,
  featured boolean not null default false,
  tags text[] not null default '{}',
  is_demo boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.store_settings (
  id integer primary key default 1,
  flat_rate_cop integer not null default 15000,
  free_from_cop integer not null default 350000,
  check (id = 1)
);
insert into public.store_settings (id) values (1) on conflict (id) do nothing;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  status text not null default 'pendiente' check (status in ('pendiente','confirmado','despachado','entregado','cancelado','devuelto')),
  customer jsonb not null,
  subtotal_cop integer not null,
  shipping_cop integer not null,
  total_cop integer not null,
  notes text,
  idempotency_key text unique,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz,
  shipped_at timestamptz,
  delivered_at timestamptz,
  cancelled_at timestamptz
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null references public.products(id),
  variant_id text,
  sku text not null,
  name text not null,
  unit_price_cop integer not null,
  qty integer not null check (qty between 1 and 99),
  line_total_cop integer not null
);

create table if not exists public.inventory_movements (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id),
  variant_id text,
  delta integer not null,
  reason text not null,
  order_id uuid references public.orders(id),
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.inventory_movements enable row level security;
alter table public.store_settings enable row level security;

drop policy if exists "products are readable by everyone" on public.products;
create policy "products are readable by everyone" on public.products
  for select using (active = true);

drop policy if exists "store_settings are readable by everyone" on public.store_settings;
create policy "store_settings are readable by everyone" on public.store_settings
  for select using (true);

create or replace function public.create_order(p_order jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer jsonb := p_order->'customer';
  v_items jsonb := p_order->'items';
  v_item jsonb;
  v_product public.products%rowtype;
  v_variant jsonb;
  v_variant_id text;
  v_qty integer;
  v_unit_price integer;
  v_stock integer;
  v_subtotal integer := 0;
  v_shipping integer;
  v_total integer;
  v_order_id uuid;
  v_code text;
  v_flat integer;
  v_free_from integer;
  v_existing_code text;
  v_existing_subtotal integer;
  v_existing_shipping integer;
  v_existing_total integer;
  v_existing_status text;
  v_existing_created timestamptz;
begin
  if v_items is null or jsonb_typeof(v_items) <> 'array' or jsonb_array_length(v_items) = 0 then
    raise exception 'El pedido no tiene productos.';
  end if;
  if coalesce(v_customer->>'nombre','') = '' then raise exception 'Nombre requerido.'; end if;
  if coalesce(v_customer->>'celular','') = '' then raise exception 'Celular requerido.'; end if;
  if coalesce(v_customer->>'direccion','') = '' then raise exception 'Dirección requerida.'; end if;
  if coalesce(v_customer->>'ciudad','') = '' then raise exception 'Ciudad requerida.'; end if;
  if coalesce(v_customer->>'departamento','') = '' then raise exception 'Departamento requerido.'; end if;

  -- idempotencia
  if p_order->>'idempotency_key' is not null and p_order->>'idempotency_key' <> '' then
    select code, subtotal_cop, shipping_cop, total_cop, status, created_at
      into v_existing_code, v_existing_subtotal, v_existing_shipping, v_existing_total, v_existing_status, v_existing_created
      from public.orders where idempotency_key = p_order->>'idempotency_key';
    if found then
      return jsonb_build_object(
        'code', v_existing_code,
        'status', v_existing_status,
        'subtotal', v_existing_subtotal,
        'shipping', v_existing_shipping,
        'total', v_existing_total,
        'created_at', v_existing_created
      );
    end if;
  end if;

  -- validar stock y calcular subtotal
  for v_item in select * from jsonb_array_elements(v_items) loop
    v_qty := (v_item->>'qty')::integer;
    if v_qty < 1 or v_qty > 99 then raise exception 'Cantidad inválida.'; end if;
    select * into v_product from public.products where id = (v_item->>'product_id') and active = true for update;
    if not found then raise exception 'Producto no disponible: %', (v_item->>'product_id'); end if;

    v_variant_id := nullif(v_item->>'variant_id','null');
    if v_variant_id is not null then
      select v into v_variant from jsonb_array_elements(v_product.variants) v where v->>'id' = v_variant_id;
      if v_variant is null then raise exception 'Variante no disponible.'; end if;
      v_unit_price := coalesce((v_variant->>'priceCOP')::integer, v_product.price_cop);
      v_stock := coalesce((v_variant->>'stock')::integer, 0);
    else
      if v_product.variants is not null and jsonb_array_length(v_product.variants) > 0 then
        raise exception 'Selecciona una opción del producto %.', v_product.name;
      end if;
      v_unit_price := v_product.price_cop;
      v_stock := v_product.stock;
    end if;

    if v_stock < v_qty and v_product.stock_policy <> 'backorder' then
      raise exception 'Stock insuficiente para %.', v_product.name;
    end if;

    v_subtotal := v_subtotal + (v_unit_price * v_qty);
  end loop;

  -- envío
  select flat_rate_cop, free_from_cop into v_flat, v_free_from from public.store_settings where id = 1;
  if v_subtotal >= v_free_from then v_shipping := 0; else v_shipping := v_flat; end if;
  v_total := v_subtotal + v_shipping;

  -- código
  v_code := 'EST-' || to_char(now(), 'YYYYMM') || '-' || lpad(nextval('public.order_code_seq')::text, 5, '0');

  -- insertar pedido
  insert into public.orders (code, status, customer, subtotal_cop, shipping_cop, total_cop, notes, idempotency_key)
  values (v_code, 'pendiente', v_customer, v_subtotal, v_shipping, v_total, nullif(p_order->>'notes',''), nullif(p_order->>'idempotency_key',''))
  returning id into v_order_id;

  -- items + stock
  for v_item in select * from jsonb_array_elements(v_items) loop
    v_qty := (v_item->>'qty')::integer;
    select * into v_product from public.products where id = (v_item->>'product_id');
    v_variant_id := nullif(v_item->>'variant_id','null');

    if v_variant_id is not null then
      select v into v_variant from jsonb_array_elements(v_product.variants) v where v->>'id' = v_variant_id;
      v_unit_price := coalesce((v_variant->>'priceCOP')::integer, v_product.price_cop);
      update public.products
      set variants = (
        select jsonb_agg(case when v->>'id' = v_variant_id
          then jsonb_set(v, '{stock}', to_jsonb(greatest(coalesce((v->>'stock')::integer,0) - v_qty, 0)))
          else v end)
        from jsonb_array_elements(variants) v
      ), updated_at = now()
      where id = v_product.id;
    else
      v_unit_price := v_product.price_cop;
      update public.products set stock = greatest(stock - v_qty, 0), updated_at = now() where id = v_product.id;
    end if;

    insert into public.order_items (order_id, product_id, variant_id, sku, name, unit_price_cop, qty, line_total_cop)
    values (v_order_id, v_product.id, v_variant_id, v_product.sku, v_product.name, v_unit_price, v_qty, v_unit_price * v_qty);

    insert into public.inventory_movements (product_id, variant_id, delta, reason, order_id)
    values (v_product.id, v_variant_id, -v_qty, 'order', v_order_id);
  end loop;

  return jsonb_build_object(
    'code', v_code,
    'status', 'pendiente',
    'subtotal', v_subtotal,
    'shipping', v_shipping,
    'total', v_total,
    'created_at', now()
  );
end;
$$;

grant usage on schema public to anon, authenticated;
grant select on public.products, public.store_settings to anon, authenticated;
grant execute on function public.create_order(jsonb) to anon, authenticated;
PY