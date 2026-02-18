create table if not exists public.real_estate_agents (
  id uuid primary key default gen_random_uuid(),

  real_estate_id uuid not null
    references public.real_estates(id)
    on delete cascade,

  profile_id uuid not null
    references public.profiles(id)
    on delete cascade,

  role text default 'agent',
  created_at timestamptz default now(),

  unique (real_estate_id, profile_id)
);

create unique index if not exists one_real_estate_per_agent
on public.real_estate_agents (profile_id)
where role = 'admin';

alter table public.real_estate_agents enable row level security;
alter table public.real_estates enable row level security;

create policy "Agent creates only one real estate"
on public.real_estates
for insert
with check (
  auth.uid() is not null
  and exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'agent'
  )
  and not exists (
    select 1
    from public.real_estate_agents rea
    where rea.profile_id = auth.uid()
      and rea.role = 'admin'
  )
);

create policy "Users see their real estates"
on public.real_estates
for select
using (
  auth.uid() is not null
  and exists (
    select 1
    from public.real_estate_agents rea
    where rea.real_estate_id = id
      and rea.profile_id = auth.uid()
  )
);


create or replace function public.handle_new_real_estate()
returns trigger as $$
begin
  insert into public.real_estate_agents (
    real_estate_id,
    profile_id,
    role
  )
  values (
    new.id,
    auth.uid(),
    'admin'
  );

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_real_estate_created on public.real_estates;

create trigger on_real_estate_created
after insert on public.real_estates
for each row execute procedure public.handle_new_real_estate();


create policy "Users see their memberships"
on public.real_estate_agents
for select
using (profile_id = auth.uid());

create policy "Admin adds agents"
on public.real_estate_agents
for insert
with check (
  exists (
    select 1
    from public.real_estate_agents rea
    where rea.real_estate_id = real_estate_id
      and rea.profile_id = auth.uid()
      and rea.role = 'admin'
  )
);

create policy "Admin removes agents"
on public.real_estate_agents
for delete
using (
  exists (
    select 1
    from public.real_estate_agents rea
    where rea.real_estate_id = real_estate_id
      and rea.profile_id = auth.uid()
      and rea.role = 'admin'
  )
);
