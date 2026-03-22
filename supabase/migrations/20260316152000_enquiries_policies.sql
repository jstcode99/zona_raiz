-- ============================================
-- POLICIES CRUD PARA ENQUIRIES
-- ============================================
alter table public.enquiries enable row level security;
--
create policy "enquiries: selectable by admins, coordinators, assigned agents, property agents"
  on public.enquiries for select
  using (
    public.is_admin(auth.uid())
    or exists (
      select 1 from listings l
      join real_estate_agents a on a.id = l.agent_id
      where l.id = enquiries.listing_id
      and a.profile_id = auth.uid()
    )
    or exists (
      select 1 from real_estate_agents
      where id = enquiries.assigned_to
      and profile_id = auth.uid()
    )
    or public.can_manage_property ((select property_id from listings where id = enquiries.listing_id))
  );

  create policy "enquiries: updatable by admins, coordinators, assigned agents"
  on public.enquiries for update
  using (
    public.is_admin(auth.uid())
    or exists (
      select 1 from real_estate_agents
      where id = enquiries.assigned_to
      and profile_id = auth.uid()
    )
    or public.can_manage_property ((select property_id from listings where id = enquiries.listing_id))
  );

-- DELETE: Admin, Coordinador, Agente asignado
create policy "enquiries: deletable by admins, coordinators, assigned agents"
  on public.enquiries for delete
  using (
    public.is_admin(auth.uid())
    or exists (
      select 1 from real_estate_agents
      where id = enquiries.assigned_to
      and profile_id = auth.uid()
    )
    or public.can_manage_property ((select property_id from listings where id = enquiries.listing_id))
  );

-- INSERT: Todos autenticados pueden crear
create policy "enquiries: insertable by authenticated users"
  on public.enquiries for insert with check (auth.uid() is not null);


create policy "enquiries: viewable by assigned agents"
  on public.enquiries for select
  using (
    exists (
      select 1 from listings l
      join real_estate_agents a on a.id = l.agent_id
      where l.id = enquiries.listing_id
      and a.profile_id = auth.uid()
    ) or
    exists (
      select 1 from real_estate_agents
      where id = enquiries.assigned_to
      and profile_id = auth.uid()
    )
  );


grant
select,
insert,
update,
delete on public.enquiries to authenticated;
