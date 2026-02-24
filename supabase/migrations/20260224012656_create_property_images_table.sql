-- Tabla de imágenes de propiedades
create table if not exists public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties on delete cascade,
  
  -- Storage
  storage_path text not null,
  public_url text not null,
  thumbnail_url text,
  
  -- Metadata del archivo
  filename text not null,
  file_size integer,
  mime_type text,
  width integer,
  height integer,
  
  -- Organización
  display_order integer default 0,
  is_primary boolean default false,
  
  -- SEO
  alt_text text,
  caption text,
  
  created_at timestamptz default now() not null,
  
  constraint only_one_primary_per_property unique (property_id, is_primary) 
    deferrable initially deferred
);

-- Índices de property_images
create index idx_property_images_property on public.property_images(property_id);
create index idx_property_images_order on public.property_images(property_id, display_order);
create index idx_property_images_primary on public.property_images(property_id, is_primary) 
  where is_primary = true;