-- =========================================
-- 1. Helper function para leer role desde JWT
-- =========================================

create or replace function public.get_user_role()
returns text
language sql
stable
as $$
  select auth.jwt() ->> 'role';
$$;


-- =========================================
-- 2. Eliminar policies antiguas problemáticas
-- =========================================

drop policy if exists "Users read own profile" on public.profiles;
drop policy if exists "System can create profiles" on public.profiles;
drop policy if exists "Users update own profile" on public.profiles;
drop policy if exists "Admins can update any profile" on public.profiles;
drop policy if exists "Admins can delete profiles" on public.profiles;


-- =========================================
-- 3. SELECT
-- Usuarios ven su perfil, admins ven todos
-- =========================================

create policy "Users read own profile"
on public.profiles
for select
to authenticated
using (
  auth.uid() = id
  or public.get_user_role() = 'admin'
);


-- =========================================
-- 4. INSERT
-- Solo crear su propio perfil (trigger)
-- =========================================

create policy "System can create profiles"
on public.profiles
for insert
to authenticated
with check (
  auth.uid() = id
);


-- =========================================
-- 5. UPDATE usuario normal
-- Solo su perfil
-- =========================================

create policy "Users update own profile"
on public.profiles
for update
to authenticated
using (
  auth.uid() = id
)
with check (
  auth.uid() = id
);


-- =========================================
-- 6. UPDATE admin
-- Puede modificar cualquier perfil
-- =========================================

create policy "Admins can update any profile"
on public.profiles
for update
to authenticated
using (
  public.get_user_role() = 'admin'
);


-- =========================================
-- 7. DELETE admin
-- =========================================

create policy "Admins can delete profiles"
on public.profiles
for delete
to authenticated
using (
  public.get_user_role() = 'admin'
);
