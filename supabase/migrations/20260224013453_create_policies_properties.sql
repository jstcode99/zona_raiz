-- ============================================
-- POLICIES PARA PROPERTIES
-- ============================================

create policy "Properties: viewable by everyone" 
  on public.properties for select using (true);

create policy "Properties: insertable by agents of same real estate" 
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

-- ============================================
-- POLICIES PARA LISTINGS
-- ============================================

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
-- POLICIES PARA PROPERTY_IMAGES
-- ============================================

create policy "Images: viewable by everyone" 
  on public.property_images for select using (true);

create policy "Images: manageable by property agents" 
  on public.property_images for all 
  using (
    exists (
      select 1 from real_estate_agents a
      join properties p on p.real_estate_id = a.real_estate_id
      where a.profile_id = auth.uid() 
      and p.id = property_images.property_id
    )
  );

-- ============================================
-- POLICIES PARA INQUIRIES
-- ============================================

create policy "Inquiries: viewable by assigned agents" 
  on public.inquiries for select 
  using (
    exists (
      select 1 from listings l
      join real_estate_agents a on a.id = l.agent_id
      where l.id = inquiries.listing_id
      and a.profile_id = auth.uid()
    ) or
    exists (
      select 1 from inquiries i
      where i.id = inquiries.id
      and i.assigned_to in (
        select id from real_estate_agents where profile_id = auth.uid()
      )
    )
  );

create policy "Inquiries: insertable by everyone" 
  on public.inquiries for insert with check (true);

-- ============================================
-- POLICIES PARA FAVORITES
-- ============================================

create policy "Favorites: personal access only" 
  on public.favorites for all 
  using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

-- ============================================
-- POLICIES PARA LISTING_VIEWS
-- ============================================

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

-- allow reading
grant select on public.properties to authenticated;

-- allow inserting
grant insert on public.properties to authenticated;

-- allow updating
grant update on public.properties to authenticated;

-- allow deleting
grant delete on public.properties to authenticated;