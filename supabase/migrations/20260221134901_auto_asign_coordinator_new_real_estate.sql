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

  -- 🟢 CASO SEED / SQL DIRECTO: no hay sesión, saltar todo
  if v_uid is null then
    raise log 'Seed mode detected - skipping coordinator auto assignment';
    return new;
  end if;

  v_is_admin := public.is_admin(v_uid);

  raise log 'handle_new_real_estate: uid=%, is_admin=%', v_uid, v_is_admin;

  -- Solo usuarios normales tienen restricción de una sola inmobiliaria
  if not v_is_admin and exists (
    select 1 from public.real_estate_agents
    where profile_id = v_uid
      and role = 'coordinator'
  ) then
    raise exception 'Ya eres coordinador de otra inmobiliaria';
  end if;

  -- Asignar como coordinador de la nueva inmobiliaria
  insert into public.real_estate_agents (real_estate_id, profile_id, role)
  values (new.id, v_uid, 'coordinator');

  return new;
end;
$$;

-- Trigger
create trigger on_real_estate_created
  after insert on public.real_estates
  for each row
  execute function public.handle_new_real_estate();
