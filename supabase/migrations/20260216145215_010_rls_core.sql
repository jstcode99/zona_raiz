alter table public.properties enable row level security;
alter table public.property_listings enable row level security;
alter table public.real_estates enable row level security;
alter table public.listing_ads enable row level security;

create policy "Public read published listings"
on public.property_listings for select
using (
  status = 'published'
  and deleted_at is null
);

create policy "Public read active properties"
on public.properties for select
using (deleted_at is null);
