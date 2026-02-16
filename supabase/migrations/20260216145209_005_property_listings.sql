create type listing_status as enum ('draft','published','archived');

create type business_type as enum ('sale','rent','other');

create table if not exists public.property_listings (
    id uuid primary key default gen_random_uuid (),
    property_id uuid references public.properties (id),
    real_estate_id uuid references public.real_estates (id),
    slug text unique,
    meta_title text,
    meta_description text,
    description text,
    price numeric default 0,
    currency text default 'COP',
    title text,
    whatsapp_contact text,
    status listing_status default 'draft',
    business_type business_type default 'sale',
    is_featured boolean default false,
    published_at timestamptz,
    created_at timestamptz default now(),
    deleted_at timestamptz
);

create unique index if not exists idx_listings_slug
on public.property_listings(slug);