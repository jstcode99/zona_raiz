create policy "Profiles: searchable by agents"
on public.profiles
for select
to authenticated
using (
  exists (
    select 1
    from real_estate_agents
    where profile_id = auth.uid()
  )
);