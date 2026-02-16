create materialized view if not exists public.homepage_listings_cache as
select
  l.id as listing_id,
  l.title,
  l.price,
  l.currency,
  p.city,
  p.neighborhood,
  p.latitude,
  p.longitude,
  l.is_featured,
  coalesce(a.priority, 0) as ad_priority,
  l.created_at
from public.property_listings l
join public.properties p on p.id = l.property_id
left join public.listing_ads a
  on a.listing_id = l.id
  and a.is_active = true
  and a.deleted_at is null
  and now() between a.start_date and a.end_date
where
  l.status = 'published'
  and l.deleted_at is null
  and p.deleted_at is null;


create unique index if not exists idx_home_cache_listing
on public.homepage_listings_cache(listing_id);

create index if not exists idx_home_cache_rank
on public.homepage_listings_cache(ad_priority desc, is_featured desc, created_at desc);

create index if not exists idx_home_cache_city
on public.homepage_listings_cache(city);


create or replace function public.refresh_homepage_cache()
returns void
language sql
security definer
as $$
  refresh materialized view concurrently public.homepage_listings_cache;
$$;


alter materialized view public.homepage_listings_cache owner to postgres;

grant select on public.homepage_listings_cache to anon, authenticated;