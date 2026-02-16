create or replace function public.search_listings(
  p_city text default null,
  p_business_type public.business_type default null,
  p_min_price numeric default null,
  p_max_price numeric default null,
  p_limit int default 20,
  p_offset int default 0
)
returns table (
  listing_id uuid,
  title text,
  price numeric,
  currency text,
  city text,
  is_featured boolean,
  ad_priority int
)
language sql
stable
as $function$
  select
    l.id as listing_id,
    l.title,
    l.price,
    l.currency::text,
    p.city,
    l.is_featured,
    coalesce(a.priority, 0)::int as ad_priority
  from public.property_listings l
  join public.properties p
    on p.id = l.property_id
  left join public.listing_ads a
    on a.listing_id = l.id
   and a.is_active = true
   and now() between a.start_date and a.end_date

  where l.status = 'published'::public.listing_status
    and l.deleted_at is null
    and p.deleted_at is null
    and (p_city is null or p.city ilike p_city)
    and (p_business_type is null or l.business_type = p_business_type)
    and (p_min_price is null or l.price >= p_min_price)
    and (p_max_price is null or l.price <= p_max_price)

  order by
    coalesce(a.priority, 0) desc,
    l.is_featured desc,
    l.created_at desc

  limit p_limit
  offset p_offset;
$function$;
