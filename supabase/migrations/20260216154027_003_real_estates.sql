create table if not exists public.real_estates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  logo_url text,
  created_at timestamptz default now(),
  deleted_at timestamptz
);
