create or replace function public.set_listing_agent()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_agent_id uuid;
  v_property_real_estate uuid;
  v_agent_real_estate uuid;
begin
  -- Si agent_id ya viene asignado (seed/admin), no hacer nada
  if new.agent_id is not null then
    return new;
  end if;

  -- Obtener el agente del usuario autenticado
  select id, real_estate_id
  into v_agent_id, v_agent_real_estate
  from public.real_estate_agents
  where profile_id = auth.uid()
  limit 1;

  if v_agent_id is null then
    raise exception 'User is not registered as real estate agent';
  end if;

  select real_estate_id
  into v_property_real_estate
  from public.properties
  where id = new.property_id;

  if v_property_real_estate is null then
    raise exception 'Property not found';
  end if;

  if v_property_real_estate <> v_agent_real_estate then
    raise exception 'Agent cannot create listing for this property';
  end if;

  new.agent_id := v_agent_id;
  return new;
end;
$$;
