-- ============================================
-- POLICIES CRUD PARA ENQUIRIES
-- ============================================
alter table public.listings enable row level security;
--
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
    or public.can_manage_property ((select property_id from listings where id = inquiries.listing_id))
  );

create policy "Inquiries: updatable by admins, coordinators, assigned agents"
  on public.inquiries for update
  using (
    public.is_admin(auth.uid())
    or exists (
      select 1 from real_estate_agents
      where id = inquiries.assigned_to
      and profile_id = auth.uid()
    )
    or public.can_manage_property ((select property_id from listings where id = inquiries.listing_id))
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
    or public.can_manage_property ((select property_id from listings where id = inquiries.listing_id))
  );

-- INSERT: Todos autenticados pueden crear
create policy "Inquiries: insertable by authenticated users"
  on public.inquiries for insert with check (auth.uid() is not null);


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
