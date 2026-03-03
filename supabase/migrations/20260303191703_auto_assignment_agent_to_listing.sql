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

  -- Obtener el agente del usuario autenticado
  select id, real_estate_id
  into v_agent_id, v_agent_real_estate
  from public.real_estate_agents
  where profile_id = auth.uid()
  limit 1;

  if v_agent_id is null then
    raise exception 'User is not registered as real estate agent';
  end if;

  -- Obtener real_estate de la propiedad
  select real_estate_id
  into v_property_real_estate
  from public.properties
  where id = new.property_id;

  if v_property_real_estate is null then
    raise exception 'Property not found';
  end if;

  -- Validar que el agente pertenezca a la misma real_estate
  if v_property_real_estate <> v_agent_real_estate then
    raise exception 'Agent cannot create listing for this property';
  end if;

  -- Asignar automáticamente el agent_id
  new.agent_id := v_agent_id;

  return new;
end;
$$;

alter function public.set_listing_agent() owner to postgres;

drop trigger if exists trg_set_listing_agent on public.listings;

create trigger trg_set_listing_agent
before insert on public.listings
for each row
execute function public.set_listing_agent();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_set_listing_updated_at on public.listings;

create trigger trg_set_listing_updated_at
before update on public.listings
for each row
execute function public.set_updated_at();