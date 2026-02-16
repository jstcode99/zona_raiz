create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  real_estate_id uuid references public.real_estates(id),

  address text,
  neighborhood text,
  city text,
  state text,
  country text,

  latitude numeric,
  longitude numeric,
  google_maps_url text,

  bedrooms int,
  bathrooms int,
  area_m2 numeric,

  created_at timestamptz default now(),
  deleted_at timestamptz
);
