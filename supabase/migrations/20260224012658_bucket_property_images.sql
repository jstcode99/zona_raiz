insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'property-images',
  'property-images',
  true,
  10485760, -- 10MB
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create or replace function public.get_property_id_from_path(path text)
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

create policy "Ver imagenes de propiedades" on storage.objects for
select using (bucket_id = 'property-images');

create policy "Subir imagenes de propiedades" on storage.objects for
insert
with
    check (
        bucket_id = 'property-images'
        and public.can_manage_property (
            public.get_property_id_from_path (name),
            auth.uid ()
        )
    );

create policy "Actualizar imagenes de propiedades" on storage.objects for
update using (
    bucket_id = 'property-images'
    and public.can_manage_property (
        public.get_property_id_from_path (name),
        auth.uid ()
    )
);

create policy "Eliminar imagenes de propiedades" on storage.objects for delete using (
    bucket_id = 'property-images'
    and public.can_manage_property (
        public.get_property_id_from_path (name),
        auth.uid ()
    )
);