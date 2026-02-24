-- Tabla de propiedades (inmuebles físicos)
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  real_estate_id uuid not null references public.real_estates on delete cascade,
  
  -- Identificación y contenido
  title text not null,
  slug text unique not null,
  description text,
  property_type property_type not null default 'other',
  
  -- Ubicación
  address text not null,
  street text,
  city text not null,
  state text not null,
  postal_code text,
  country text default 'Argentina',
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  neighborhood text,
  
  -- Características físicas
  bedrooms integer,
  bathrooms integer,
  total_area decimal(10, 2),
  built_area decimal(10, 2),
  lot_area decimal(10, 2),
  floors integer,
  year_built integer,
  parking_spots integer,
  
  -- Amenities (array flexible)
  amenities jsonb default '[]'::jsonb,
  
  -- Metadata
  created_by uuid references public.profiles on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  
  -- Búsqueda full-text para SEO
  search_vector tsvector generated always as (
    setweight(to_tsvector('spanish', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('spanish', coalesce(description, '')), 'B') ||
    setweight(to_tsvector('spanish', coalesce(city, '')), 'C') ||
    setweight(to_tsvector('spanish', coalesce(neighborhood, '')), 'C') ||
    setweight(to_tsvector('spanish', coalesce(address, '')), 'D')
  ) stored
);

-- Índices de properties
create index idx_properties_real_estate on public.properties(real_estate_id);
create index idx_properties_type on public.properties(property_type);
create index idx_properties_city on public.properties(city);
create index idx_properties_location on public.properties(state, city);
create index idx_properties_search on public.properties using gin(search_vector);
create index idx_properties_slug on public.properties(slug);
create index idx_properties_neighborhood on public.properties(neighborhood);
create index idx_properties_coords on public.properties(latitude, longitude) 
  where latitude is not null and longitude is not null;