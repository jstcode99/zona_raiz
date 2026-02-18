-- Políticas RLS robustas para perfiles

-- 1. SELECT: Usuarios ven su propio perfil, admins ven todos
create policy "Users read own profile"
  on public.profiles 
  for select 
  to authenticated
  using (
    auth.uid() = id 
    or exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- 2. INSERT: Solo el sistema puede crear perfiles (via trigger)
create policy "System can create profiles"
  on public.profiles 
  for insert 
  to authenticated
  with check (auth.uid() = id);

-- 3. UPDATE: Usuarios actualizan su propio perfil (excepto rol), admins pueden todo
create policy "Users update own profile"
  on public.profiles 
  for update 
  to authenticated
  using (auth.uid() = id)
  with check (
    auth.uid() = id 
    and role = (select role from public.profiles where id = auth.uid())
  );

-- 4. UPDATE: Admins pueden cambiar cualquier perfil incluyendo roles
create policy "Admins can update any profile"
  on public.profiles 
  for update 
  to authenticated
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- 5. DELETE: Solo admins pueden eliminar perfiles
create policy "Admins can delete profiles"
  on public.profiles 
  for delete 
  to authenticated
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );