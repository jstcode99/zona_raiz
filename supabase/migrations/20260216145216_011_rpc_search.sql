create function public.search_listings(
  p_city text default null,
  p_business_type business_type default null,
  p_min_price numeric default null,
  p_max_price numeric default null,
  p_limit int default 20,
  p_offset int default 0
)
returns table (
  listing_id uuid,
  title text,
  slug text,
  price numeric,
  currency text,
  city text,
  bedrooms int,
  bathrooms int,
  is_featured boolean,
  ad_priority int
)
language sql
stable
as $$
  select
    l.id,
    l.title,
    l.slug,
    l.price,
    l.currency,
    p.city,
    p.bedrooms,
    p.bathrooms,
    l.is_featured,
    coalesce(a.priority,0)
  from public.property_listings l
  join public.properties p on p.id = l.property_id
  left join public.listing_ads a
    on a.listing_id = l.id
    and a.is_active = true
    and a.deleted_at is null
    and now() between a.start_date and a.end_date

  where l.status = 'published'
  and l.deleted_at is null
  and p.deleted_at is null
  and (p_city is null or p.city ilike p_city)
  and (p_business_type is null or l.business_type = p_business_type)
  and (p_min_price is null or l.price >= p_min_price)
  and (p_max_price is null or l.price <= p_max_price)

  order by
    coalesce(a.priority,0) desc,
    l.is_featured desc,
    l.created_at desc

  limit p_limit
  offset p_offset;
$$;

create index if not exists idx_listings_price
on public.property_listings(price)
where deleted_at is null;

create index if not exists idx_listings_status_active
on public.property_listings(status)
where deleted_at is null;