-- Tabla de favoritos (usuarios logueados)
create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles on delete cascade,
  listing_id uuid not null references public.listings on delete cascade,
  created_at timestamptz default now() not null,
  unique(profile_id, listing_id)
);

-- Índices de favorites
create index idx_favorites_profile on public.favorites(profile_id);
create index idx_favorites_listing on public.favorites(listing_id);