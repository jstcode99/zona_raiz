-- Habilitar RLS en todas las tablas
alter table public.properties enable row level security;
alter table public.listings enable row level security;
alter table public.property_images enable row level security;
alter table public.inquiries enable row level security;
alter table public.favorites enable row level security;
alter table public.listing_views enable row level security;