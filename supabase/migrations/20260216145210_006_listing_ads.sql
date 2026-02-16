create table if not exists public.listing_ads (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.property_listings(id),
  real_estate_id uuid references public.real_estates(id),

  priority int default 0,
  start_date timestamptz,
  end_date timestamptz,
  is_active boolean default true,

  created_at timestamptz default now(),
  deleted_at timestamptz
);
