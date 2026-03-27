create or replace function public.handle_new_real_estate()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
declare
  v_uid uuid;
  v_is_admin boolean;
begin
  v_uid := auth.uid();

  -- 🟢 CASO SEED / SQL DIRECTO
  if v_uid is null then
    raise log 'Seed mode detected - skipping agent auto assignment';
    return new;
  end if;

  -- Lógica normal
  v_is_admin := public.is_admin(v_uid);

  raise log 'handle_new_real_estate: uid=%, is_admin=%', v_uid, v_is_admin;

  if not v_is_admin and exists (
    select 1 from public.real_estate_agents
    where profile_id = v_uid
    and role = 'coordinator'
  ) then
    raise exception 'Ya eres coordinador de otra inmobiliaria';
  end if;

  if not exists (
    select 1 from public.real_estate_agents
    where profile_id = v_uid
    and real_estate_id = new.id
    and role = 'coordinator'
  ) then
    insert into public.real_estate_agents (real_estate_id, profile_id, role)
    values (new.id, v_uid, 'coordinator');
  end if;

  return new;
end;
$$;
