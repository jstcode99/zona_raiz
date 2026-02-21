-- ============================================
-- BUCKET Y CONFIGURACIÓN DE STORAGE
-- ============================================

-- Crear bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'real-estate-logos',
  'real-estate-logos',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
on conflict (id) do nothing;

-- Función auxiliar para extraer real_estate_id del path
create or replace function public.get_real_estate_id_from_path(path text)
returns uuid as $$
declare
  parts text[];
begin
  parts := string_to_array(path, '/');
  return parts[1]::uuid;
exception when others then
  return null;
end;
$$ language plpgsql security definer;

-- Políticas de Storage
create policy "Ver logos"
  on storage.objects for select
  using (bucket_id = 'real-estate-logos');

create policy "Subir logos"
  on storage.objects for insert
  with check (
    bucket_id = 'real-estate-logos'
    and public.can_manage_real_estate(
      (string_to_array(name, '/'))[1]::uuid, 
      auth.uid()
    )
  );

create policy "Actualizar logos"
  on storage.objects for update
  using (
    bucket_id = 'real-estate-logos'
    and public.can_manage_real_estate(
      public.get_real_estate_id_from_path(name),
      auth.uid()
    )
  );

create policy "Eliminar logos"
  on storage.objects for delete
  using (
    bucket_id = 'real-estate-logos'
    and public.can_manage_real_estate(
      public.get_real_estate_id_from_path(name),
      auth.uid()
    )
  );