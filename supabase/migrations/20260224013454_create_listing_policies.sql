alter table public.listings enable row level security;

create policy "Listings: view active or own real estate" 
  on public.listings for select 
  using (
    status = 'active' or 
    exists (
      select 1 from real_estate_agents a
      join properties p on p.real_estate_id = a.real_estate_id
      where a.profile_id = auth.uid() 
      and p.id = listings.property_id
    )
  );

create policy "Listings: insertable by agents" 
  on public.listings for insert 
  with check (
    exists (
      select 1 from real_estate_agents 
      where id = listings.agent_id 
      and profile_id = auth.uid()
    )
  );

create policy "Listings: updatable by assigned agent or coordinator" 
  on public.listings for update 
  using (
    exists (
      select 1 from real_estate_agents 
      where id = listings.agent_id 
      and profile_id = auth.uid()
    ) or
    exists (
      select 1 from real_estate_agents a
      join properties p on p.real_estate_id = a.real_estate_id
      where a.profile_id = auth.uid() 
      and a.role = 'coordinator'
      and p.id = listings.property_id
    )
  );


-- ============================================
-- POLICIES PARA LISTING_VIEWS
-- ============================================
alter table public.listing_views enable row level security;

create policy "Views: insertable by everyone" 
  on public.listing_views for insert with check (true);

create policy "Views: readable by agents" 
  on public.listing_views for select 
  using (
    exists (
      select 1 from listings l
      join real_estate_agents a on a.id = l.agent_id
      where l.id = listing_views.listing_id
      and a.profile_id = auth.uid()
    )
  );