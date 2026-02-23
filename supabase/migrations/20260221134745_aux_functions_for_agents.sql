-- ============================================
-- FUNCIONES DE PERMISOS (reutilizables)
-- ============================================


-- Verificar si es coordinador de una inmobiliaria específica
create or replace function public.is_coordinator_of(
  p_real_estate_id uuid,
  p_user_id uuid default auth.uid()
)
returns boolean
as $$
begin
  return exists (
    select 1 from public.real_estate_agents
    where profile_id = p_user_id
      and real_estate_id = p_real_estate_id
      and role = 'coordinator'
  );
end;
$$ language plpgsql security definer;

-- Verificar si es agente (cualquier rol) de una inmobiliaria
create or replace function public.is_agent_of(
  p_real_estate_id uuid,
  p_user_id uuid default auth.uid()
)
returns boolean
as $$
begin
  return exists (
    select 1 from public.real_estate_agents
    where profile_id = p_user_id
      and real_estate_id = p_real_estate_id
  );
end;
$$ language plpgsql security definer;

-- Obtener el real_estate_id donde es coordinador (null si no tiene)
create or replace function public.get_coordinator_real_estate(
  p_user_id uuid default auth.uid()
)
returns uuid
as $$
declare
  v_real_estate_id uuid;
begin
  select real_estate_id into v_real_estate_id
  from public.real_estate_agents
  where profile_id = p_user_id 
    and role = 'coordinator'
  limit 1;
  
  return v_real_estate_id;
end;
$$ language plpgsql security definer;

-- Verificar si puede gestionar una inmobiliaria (admin o coordinador de esa inmobiliaria)
create or replace function public.can_manage_real_estate(
  p_real_estate_id uuid,
  p_user_id uuid default auth.uid()
)
returns boolean
as $$
begin
  return public.is_admin(p_user_id) 
    or public.is_coordinator_of(p_real_estate_id, p_user_id);
end;
$$ language plpgsql security definer;

create or replace function public.check_single_coordinator()
returns trigger as $$
begin
  if new.role = 'coordinator' and exists (
    select 1 from public.real_estate_agents 
    where real_estate_id = new.real_estate_id 
    and role = 'coordinator'
    and id != coalesce(new.id, gen_random_uuid())
  ) then
    raise exception 'Ya existe un coordinador para esta inmobiliaria';
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists ensure_single_coordinator on public.real_estate_agents;
create trigger ensure_single_coordinator
  before insert or update on public.real_estate_agents
  for each row execute procedure public.check_single_coordinator();