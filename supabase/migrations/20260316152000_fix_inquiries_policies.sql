-- ============================================
-- FIX: Remove recursive query in inquiries policy
-- ============================================

-- Drop the problematic policy
drop policy if exists "Inquiries: viewable by assigned agents" on public.inquiries;

-- Recreate with corrected condition (no self-join recursion)
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
