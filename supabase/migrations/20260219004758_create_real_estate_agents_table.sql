create table if not exists public.real_estate_agents (
  id uuid primary key default gen_random_uuid(),
  real_estate_id uuid not null references public.real_estates on delete cascade,
  profile_id uuid not null references public.profiles on delete cascade,
  role text not null check (role in ('agent', 'coordinator')),
  created_at timestamptz default now() not null,
  unique(real_estate_id, profile_id)
);

-- Índices para búsquedas frecuentes
create index idx_real_estate_agents_real_estate_id on public.real_estate_agents(real_estate_id);
create index idx_real_estate_agents_profile_id on public.real_estate_agents(profile_id);

-- Habilitar RLS
alter table public.real_estate_agents enable row level security;
alter table public.real_estate_agents force row level security;

comment on table public.real_estate_agents is 'Relación entre perfiles e inmobiliarias con sus roles';