-- ============================================
-- REAL_ESTATES
-- ============================================

-- Select: todos ven todo
create policy "Ver inmobiliarias"
  on public.real_estates for select
  using (true);

-- Insert: coordinadores sin inmobiliaria, o admins
create policy "Crear inmobiliarias"
  on public.real_estates for insert
  with check (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() 
      and role in ('coordinator', 'admin')
    )
  );

-- Update: admin o coordinador de esa inmobiliaria
create policy "Actualizar inmobiliarias"
  on public.real_estates for update
  using (public.can_manage_real_estate(id, auth.uid()))
  with check (public.can_manage_real_estate(id, auth.uid()));

-- Delete: solo admin
create policy "Eliminar inmobiliarias"
  on public.real_estates for delete
  using (public.is_admin(auth.uid()));

grant all on public.real_estates to authenticated;
