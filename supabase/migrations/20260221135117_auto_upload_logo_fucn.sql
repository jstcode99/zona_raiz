-- Función para actualizar solo el logo_url (usada desde el cliente)
create or replace function public.update_real_estate_logo(
  p_real_estate_id uuid,
  p_logo_url text
)
returns void as $$
begin
  -- Verificar que sea coordinador de esta inmobiliaria o admin
  if not (public.is_coordinator_of(p_real_estate_id) or public.is_admin()) then
    raise exception 'No tienes permisos para actualizar el logo de esta inmobiliaria';
  end if;
  
  update public.real_estates
  set logo_url = p_logo_url
  where id = p_real_estate_id;
end;
$$ language plpgsql security definer;
