create policy "Avatar: Avatar public read access" on storage.objects for
select to anon, authenticated using (bucket_id = 'avatars');

-- 2. INSERT: Usuarios autenticados solo pueden subir a su propia carpeta
-- Estructura: avatars/{user_id}/filename.ext
create policy "Avatar: Users upload own avatar"
  on storage.objects 
  for insert 
  to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
    and (storage.extension(name)) in ('jpg', 'jpeg', 'png', 'webp', 'gif')
  );

-- 3. UPDATE: Usuarios solo pueden actualizar sus propios archivos
create policy "Avatar: Users update own avatar"
  on storage.objects 
  for update 
  to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- 4. DELETE: Usuarios solo pueden eliminar sus propios archivos, admins cualquiera
create policy "Avatar: Users delete own avatar"
  on storage.objects 
  for delete 
  to authenticated
  using (
    bucket_id = 'avatars'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or exists (
        select 1 from public.profiles 
        where id = auth.uid() and role = 'admin'
      )
    )
  );