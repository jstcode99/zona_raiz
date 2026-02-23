-- =========================================
-- Permisos base de PostgreSQL
-- =========================================

grant usage on schema public to authenticated;

grant select, insert, update, delete
on table public.profiles
to authenticated;

-- si usas triggers o funciones que insertan
grant usage, select
on all sequences in schema public
to authenticated;