alter table public.real_estate_agents enable row level security;

create policy "Agents: All can read agents" on public.real_estate_agents for
select using (true);

create policy "Agents: Add agents" on public.real_estate_agents for
insert
with
    check (
        public.can_manage_real_estate (real_estate_id, auth.uid())
        and not( -- <-- AGREGADO: previene auto-asignación como coordinador si ya lo es
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

create policy "Agents: User admin or coordinator can update agents" on public.real_estate_agents for
update using (
    public.is_admin (auth.uid ())
    or (
        public.is_coordinator_of (real_estate_id, auth.uid ())
        and profile_id != auth.uid ()
    )
)
with
    check ( -- <-- AGREGADO
        public.is_admin (auth.uid ())
        or (
            public.is_coordinator_of (real_estate_id, auth.uid ())
            and profile_id != auth.uid ()
        )
    );

create policy "Agents: User admin or coordinator can delete agents" on public.real_estate_agents for delete using (
    public.is_admin (auth.uid ())
    or (
        public.is_coordinator_of (real_estate_id, auth.uid ())
        and profile_id != auth.uid ()
    )
);

create policy "Profiles: searchable by agents"
on public.profiles
for select
to authenticated
using (
  exists (
    select 1
    from real_estate_agents
    where profile_id = auth.uid()
  )
);
