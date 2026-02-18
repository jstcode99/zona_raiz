-- Funciones auxiliares de seguridad reutilizables

-- Verificar si usuario es admin
create or replace function public.is_admin(user_id uuid)
returns boolean
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from public.profiles 
    where id = user_id and role = 'admin'
  );
end;
$$ language plpgsql;

-- Verificar si usuario tiene rol específico
create or replace function public.has_role(user_id uuid, required_role public.user_role)
returns boolean
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from public.profiles 
    where id = user_id and role = required_role
  );
end;
$$ language plpgsql;

comment on function public.is_admin(uuid) is 'Verifica si un usuario tiene rol admin';
comment on function public.has_role(uuid, public.user_role) is 'Verifica si un usuario tiene un rol específico';