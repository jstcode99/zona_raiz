-- Tabla de consultas/leads
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings on delete cascade,

  -- Datos del interesado
  name text not null,
  email text,
  phone text,
  message text,

  -- Tracking
  source inquiry_source default 'web',
  utm_source text,
  utm_medium text,
  utm_campaign text,
  referrer text,
  ip_address inet,
  user_agent text,

  -- Gestión del lead
  status inquiry_status default 'new',
  notes text,
  assigned_to uuid references public.real_estate_agents,

  -- Timestamps
  created_at timestamptz default now() not null,
  contacted_at timestamptz,
  converted_at timestamptz
);

-- Índices de enquiries
create index idx_enquiries_listing on public.enquiries(listing_id);
create index idx_enquiries_status on public.enquiries(status);
create index idx_enquiries_created on public.enquiries(created_at desc);
create index idx_enquiries_assigned on public.enquiries(assigned_to);
create index idx_enquiries_source on public.enquiries(source);
