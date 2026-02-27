create table if not exists public.property_images (
    id uuid primary key default gen_random_uuid (),
    property_id uuid not null references public.properties on delete cascade,
    public_url text,
    filename text not null,
    file_size integer,
    mime_type text,
    width integer,
    height integer,
    display_order integer default 0,
    is_primary boolean default false,
    alt_text text,
    caption text,
    created_at timestamptz default now() not null
);

-- Índices de property_images
create index idx_property_images_property on public.property_images (property_id);

create unique index only_one_primary_per_property on public.property_images (property_id)
where
    is_primary = true;

create index idx_property_images_order on public.property_images (property_id, display_order);

create index idx_property_images_primary on public.property_images (property_id, is_primary)
where
    is_primary = true;

alter table property_images
add constraint min_image_dimensions check (
    (
        width is null
        or width >= 400
    )
    and (
        height is null
        or height >= 300
    )
);