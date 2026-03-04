create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  avatar_url text,
  email text unique,
  phone text unique,
  role public.user_role default 'client'::public.user_role not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Índices optimizados para RLS y búsquedas frecuentes
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_phone on public.profiles(phone) where phone is not null;

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

create trigger on_profile_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();


