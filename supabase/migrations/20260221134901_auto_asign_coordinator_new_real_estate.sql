-- Función que se ejecuta después de insertar una real_estate
create or replace function public.handle_new_real_estate()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
declare
  v_is_admin boolean;
begin
  -- Guardamos el resultado en variable para poder debuggear
  v_is_admin := public.is_admin(auth.uid());

  raise log 'handle_new_real_estate: uid=%, is_admin=%', auth.uid(), v_is_admin;

  if not v_is_admin and exists (
    select 1 from public.real_estate_agents
    where profile_id = auth.uid()
    and role = 'coordinator'
  ) then
    raise exception 'Ya eres coordinador de otra inmobiliaria';
  end if;

  if not exists (
    select 1 from public.real_estate_agents
    where profile_id = auth.uid()
    and real_estate_id = new.id
    and role = 'coordinator'
  ) then
    insert into public.real_estate_agents (real_estate_id, profile_id, role)
    values (new.id, auth.uid(), 'coordinator');
  end if;

  return new;
end;
$$;

drop trigger if exists on_real_estate_created on public.real_estates;

create trigger on_real_estate_created
  after insert on public.real_estates
  for each row execute procedure public.handle_new_real_estate();
