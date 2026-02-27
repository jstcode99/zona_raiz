create table if not exists public.real_estates (
    id uuid primary key default gen_random_uuid (),
    name text not null,
    description text,
    whatsapp text,
    street text,
    city text,
    state text,
    postal_code text,
    country text,
    logo_url text,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- Trigger para updated_at
create or replace function public.handle_real_estate_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

create trigger on_real_estate_updated
  before update on public.real_estates
  for each row execute procedure public.handle_real_estate_updated_at();