create index if not exists idx_properties_city
on public.properties(city)
where deleted_at is null;

create index if not exists idx_properties_price
on public.properties(price)
where deleted_at is null;

create index if not exists idx_properties_slug
on public.properties(slug);

create index if not exists idx_listings_status
on public.property_listings(status)
where deleted_at is null;

create index if not exists idx_ads_active
on public.listing_ads(listing_id)
where deleted_at is null;
