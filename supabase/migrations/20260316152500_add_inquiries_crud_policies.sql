-- ============================================
-- POLICIES CRUD PARA INQUIRIES
-- ============================================

-- UPDATE: Agents assigned to the inquiry OR agents of the listing's real estate
create policy "Inquiries: updatable by assigned agents or listing agents" 
  on public.inquiries for update 
  using (
    exists (
      select 1 from real_estate_agents
      where id = inquiries.assigned_to
      and profile_id = auth.uid()
    ) or
    exists (
      select 1 from listings l
      join real_estate_agents a on a.id = l.agent_id
      where l.id = inquiries.listing_id
      and a.profile_id = auth.uid()
    )
  );

-- DELETE: Agents assigned to the inquiry OR agents of the listing's real estate
create policy "Inquiries: deletable by assigned agents or listing agents" 
  on public.inquiries for delete 
  using (
    exists (
      select 1 from real_estate_agents
      where id = inquiries.assigned_to
      and profile_id = auth.uid()
    ) or
    exists (
      select 1 from listings l
      join real_estate_agents a on a.id = l.agent_id
      where l.id = inquiries.listing_id
      and a.profile_id = auth.uid()
    )
  );
