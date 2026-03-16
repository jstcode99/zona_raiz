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
      select 1 from real_estate_agents
      where id = inquiries.assigned_to
      and profile_id = auth.uid()
    )
  );

create policy "Inquiries: insertable by everyone" 
  on public.inquiries for insert with check (true);

-- ============================================
-- POLICIES PARA FAVORITES
-- ============================================
