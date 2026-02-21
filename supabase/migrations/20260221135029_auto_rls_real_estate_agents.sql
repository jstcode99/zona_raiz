-- ============================================
-- REAL_ESTATE_AGENTS
-- ============================================

-- Select: todos ven
create policy "Ver agentes" on public.real_estate_agents for
select using (true);

-- Insert: admin o coordinador de esa inmobiliaria
-- Además: no permite auto-asignarse como coordinador si ya es coordinador
create policy "Agregar agentes" on public.real_estate_agents for insert
with
    check (
        public.can_manage_real_estate (real_estate_id, auth.uid ())
        and not ( -- <-- AGREGADO: previene auto-asignación como coordinador si ya lo es
            role = 'coordinator'
            and profile_id = auth.uid ()
            and exists (
                select 1
                from public.real_estate_agents
                where
                    profile_id = auth.uid ()
                    and role = 'coordinator'
            )
        )
    );

-- Update: admin, o coordinador de esa inmobiliaria (pero no puede editarse a sí mismo)
create policy "Actualizar agentes"
  on public.real_estate_agents for update
  using (
    public.is_admin(auth.uid())
    or (
      public.is_coordinator_of(real_estate_id, auth.uid())
      and profile_id != auth.uid()
    )
  )
  with check (  -- <-- AGREGADO
    public.is_admin(auth.uid())
    or (
      public.is_coordinator_of(real_estate_id, auth.uid())
      and profile_id != auth.uid()
    )
  );

-- Delete: admin, o coordinador de esa inmobiliaria (pero no eliminarse a sí mismo)
create policy "Eliminar agentes" on public.real_estate_agents for delete using (
    public.is_admin (auth.uid ())
    or (
        public.is_coordinator_of (real_estate_id, auth.uid ())
        and profile_id != auth.uid ()
    )
);