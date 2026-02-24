-- Tabla de analytics (vistas)
create table if not exists public.listing_views (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings on delete cascade,
  viewer_ip inet,
  viewer_user_agent text,
  referrer text,
  created_at timestamptz default now() not null
);

-- Índices de listing_views
create index idx_listing_views_listing on public.listing_views(listing_id, created_at);
create index idx_listing_views_created on public.listing_views(created_at);