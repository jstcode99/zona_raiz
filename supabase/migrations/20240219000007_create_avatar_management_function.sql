-- Función segura para actualizar avatar_url en perfil
create or replace function public.update_user_avatar(avatar_path text)
returns void
security definer
set search_path = public
as $$
begin
  -- Validar que el path pertenece al usuario actual
  if not (avatar_path like auth.uid()::text || '/%') then
    raise exception 'Invalid avatar path: must be in user folder';
  end if;

  update public.profiles 
  set avatar_url = avatar_path,
      updated_at = now()
  where id = auth.uid();
  
  if not found then
    raise exception 'Profile not found';
  end if;
end;
$$ language plpgsql;

comment on function public.update_user_avatar(text) is 'Actualiza el avatar del usuario actual de forma segura';