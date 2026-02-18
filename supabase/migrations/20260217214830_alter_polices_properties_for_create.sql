drop policy if exists "Block client inserts properties" on public.properties;

create policy "Agents or admins can insert properties"
on public.properties
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('AGENT', 'PLATFORM_ADMIN')
  )
);

drop policy if exists "Block client updates properties" on public.properties;

create policy "Agents or admins can update properties"
on public.properties
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role in ('AGENT', 'PLATFORM_ADMIN')
  )
);

alter table public.profiles
add constraint valid_role
check (role in ('CLIENT', 'AGENT', 'PLATFORM_ADMIN'));
