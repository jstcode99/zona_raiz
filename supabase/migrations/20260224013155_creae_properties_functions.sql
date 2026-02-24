-- Función para generar slug único

-- Función para validar que el agente pertenece a la misma inmobiliaria que la propiedad
create or replace function validate_agent_real_estate()
returns trigger as $$
declare
  property_real_estate_id uuid;
  agent_real_estate_id uuid;
begin
  select real_estate_id into property_real_estate_id 
  from properties where id = new.property_id;
  
  select real_estate_id into agent_real_estate_id 
  from real_estate_agents where id = new.agent_id;
  
  if property_real_estate_id != agent_real_estate_id then
    raise exception 'Agent does not belong to the same real estate as the property';
  end if;
  
  return new;
end;
$$ language plpgsql;

-- Trigger de validación de agente
create trigger validate_listing_agent 
  before insert or update on public.listings 
  for each row execute function validate_agent_real_estate();