-- ============================================
-- POLICIES CRUD PARA INQUIRIES CON ROLES
-- ============================================

-- SELECT: Admin, Coordinador (de la inmobiliaria de la propiedad), Agente asignado, Agente de la propiedad
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

-- UPDATE: Admin, Coordinador (de la inmobiliaria), Agente asignado
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

-- DELETE: Admin, Coordinador (de la inmobiliaria), Agente asignado
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

-- INSERT: Permitido para todos los autenticados (ya existe)
-- Se mantiene la política existente: "Inquiries: insertable by everyone"
