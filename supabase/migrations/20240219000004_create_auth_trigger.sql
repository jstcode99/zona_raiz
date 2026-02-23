-- Trigger para crear perfil automáticamente al registrar usuario
create or replace function public.handle_new_user()
returns trigger 
security definer 
set search_path = public
as $$
declare
  default_role public.user_role;
  user_full_name text;
  user_phone text;
  user_avatar text;
begin
  -- Extraer metadata con valores por defecto seguros
  user_full_name := coalesce(new.raw_user_meta_data ->> 'full_name', '');
  user_phone := nullif(trim(new.raw_user_meta_data ->> 'phone'), '');
  user_avatar := nullif(trim(new.raw_user_meta_data ->> 'avatar_url'), '');
  
  -- Determinar rol (default 'client' para seguridad)
  begin
    default_role := coalesce(
      (new.raw_user_meta_data ->> 'role')::public.user_role, 
      'client'::public.user_role
    );
  exception when others then
    default_role := 'client'::public.user_role;
  end;

  -- Insertar perfil
  insert into public.profiles (
    id, 
    full_name, 
    avatar_url, 
    phone, 
    role
  ) values (
    new.id,
    user_full_name,
    user_avatar,
    user_phone,
    default_role
  )
  on conflict (id) do nothing;

  return new;
exception when others then
  -- Log error pero no fallar la creación de usuario
  raise warning 'Error creating profile for user %: %', new.id, sqlerrm;
  return new;
end;
$$ language plpgsql;

-- Eliminar trigger existente si existe
drop trigger if exists on_auth_user_created on auth.users;

-- Crear trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

comment on function public.handle_new_user() is 'Crea perfil automáticamente cuando se registra un usuario';