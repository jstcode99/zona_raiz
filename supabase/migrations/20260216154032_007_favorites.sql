create table if not exists public.favorite_properties (
  profile_id uuid references public.profiles(id) on delete cascade,
  property_id uuid references public.properties(id) on delete cascade,
  created_at timestamptz default now(),
  primary key(profile_id, property_id)
);

alter table public.favorite_properties enable row level security;

create policy "Users manage own favorites"
on public.favorite_properties for all
using (profile_id = auth.uid());
