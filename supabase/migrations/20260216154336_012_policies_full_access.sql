alter table public.profiles enable row level security;
alter table public.real_estates enable row level security;
alter table public.properties enable row level security;
alter table public.property_listings enable row level security;
alter table public.listing_ads enable row level security;
alter table public.favorite_properties enable row level security;


drop policy if exists "Users read own profile" on public.profiles;

create policy "Users read own profile"
on public.profiles
for select
using (auth.uid() = id);

create policy "Users update own profile"
on public.profiles
for update
using (auth.uid() = id);

drop policy if exists "Public read active properties" on public.properties;

create policy "Public read active properties"
on public.properties
for select
using (deleted_at is null);

drop policy if exists "Public read published listings" on public.property_listings;

create policy "Public read published listings"
on public.property_listings
for select
using (
  status = 'published'
  and deleted_at is null
);


drop policy if exists "Users manage own favorites" on public.favorite_properties;

create policy "Users read own favorites"
on public.favorite_properties
for select
using (profile_id = auth.uid());

create policy "Users insert own favorites"
on public.favorite_properties
for insert
with check (profile_id = auth.uid());

create policy "Users delete own favorites"
on public.favorite_properties
for delete
using (profile_id = auth.uid());


create policy "Public read active ads"
on public.listing_ads
for select
using (
  is_active = true
  and deleted_at is null
  and now() between start_date and end_date
);


create policy "Block client inserts properties"
on public.properties
for insert
to authenticated
with check (false);

create policy "Block client updates properties"
on public.properties
for update
to authenticated
using (false);

create policy "Block client inserts listings"
on public.property_listings
for insert
to authenticated
with check (false);

create policy "Block client updates listings"
on public.property_listings
for update
to authenticated
using (false);

create policy "Block client inserts ads"
on public.listing_ads
for insert
to authenticated
with check (false);

create policy "Block client updates ads"
on public.listing_ads
for update
to authenticated
using (false);
