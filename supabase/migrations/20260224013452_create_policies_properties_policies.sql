alter table public.properties enable row level security;

create policy "Properties: Properties viewable by everyone" 
  on public.properties for select using (true);

create policy "Properties: Create by agents of same real estate" 
  on public.properties for insert 
  with check (
    exists (
      select 1 from real_estate_agents 
      where profile_id = auth.uid() 
      and real_estate_id = properties.real_estate_id
    )
  );

create policy "Properties: updatable by agents of same real estate" 
  on public.properties for update 
  using (
    exists (
      select 1 from real_estate_agents 
      where profile_id = auth.uid() 
      and real_estate_id = properties.real_estate_id
    )
  );

create policy "Properties: deletable by agents of same real estate" 
  on public.properties for delete 
  using (
    exists (
      select 1 from real_estate_agents 
      where profile_id = auth.uid() 
      and real_estate_id = properties.real_estate_id
    )
  );

create policy "Favorites: personal access only" 
  on public.favorites for all 
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());
grant all on public.properties to authenticated;