-- ============================================
-- REEMPLAZAR POLICIES DE INQUIRIES
-- ============================================

-- Eliminar policies existentes
drop policy if exists "Inquiries: viewable by assigned agents" on public.inquiries;
drop policy if exists "Inquiries: updatable by assigned agents or listing agents" on public.inquiries;
drop policy if exists "Inquiries: deletable by assigned agents or listing agents" on public.inquiries;
drop policy if exists "Inquiries: insertable by everyone" on public.inquiries;

-- SELECT: Admin, Coordinador, Agente asignado, Agente de la propiedad
create policy "Inquiries: selectable by admins, coordinators, assigned agents, property agents" 
  on public.inquiries for select 
  using (
    public.is_admin(auth.uid())
    or exists (
      select 1 from listings l
      join real_estate_agents a on a.id = l.agent_id
      where l.id = inquiries.listing_id
      and a.profile_id = auth.uid()
    )
    or exists (
      select 1 from real_estate_agents
      where id = inquiries.assigned_to
      and profile_id = auth.uid()
    )
    or public.is_coordinator_of(
      (select real_estate_id from listings where id = inquiries.listing_id),
      auth.uid()
    )
  );

-- UPDATE: Admin, Coordinador, Agente asignado
create policy "Inquiries: updatable by admins, coordinators, assigned agents" 
  on public.inquiries for update 
  using (
    public.is_admin(auth.uid())
    or exists (
      select 1 from real_estate_agents
      where id = inquiries.assigned_to
      and profile_id = auth.uid()
    )
    or public.is_coordinator_of(
      (select real_estate_id from listings where id = inquiries.listing_id),
      auth.uid()
    )
  );

-- DELETE: Admin, Coordinador, Agente asignado
create policy "Inquiries: deletable by admins, coordinators, assigned agents" 
  on public.inquiries for delete 
  using (
    public.is_admin(auth.uid())
    or exists (
      select 1 from real_estate_agents
      where id = inquiries.assigned_to
      and profile_id = auth.uid()
    )
    or public.is_coordinator_of(
      (select real_estate_id from listings where id = inquiries.listing_id),
      auth.uid()
    )
  );

-- INSERT: Todos autenticados pueden crear
create policy "Inquiries: insertable by authenticated users" 
  on public.inquiries for insert with check (auth.uid() is not null);
