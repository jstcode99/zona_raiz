create index if not exists idx_properties_city
on public.properties(city)
where deleted_at is null;

create index if not exists idx_property_listings_price
on public.property_listings(price)
where deleted_at is null;

create index if not exists idx_property_listings_slug
on public.property_listings(slug);

create index if not exists idx_listings_status
on public.property_listings(status)
where deleted_at is null;

create index if not exists idx_ads_active
on public.listing_ads(listing_id)
where deleted_at is null;
