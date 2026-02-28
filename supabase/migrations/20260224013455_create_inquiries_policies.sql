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
