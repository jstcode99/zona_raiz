-- Tabla de consultas/leads
create table if not exists public.inquiries (
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

-- Índices de inquiries
create index idx_inquiries_listing on public.inquiries(listing_id);
create index idx_inquiries_status on public.inquiries(status);
create index idx_inquiries_created on public.inquiries(created_at desc);
create index idx_inquiries_assigned on public.inquiries(assigned_to);
create index idx_inquiries_source on public.inquiries(source);