-- Función que se ejecuta después de insertar una real_estate
create or replace function public.handle_new_real_estate()
returns trigger as $$
begin
  -- Verificar que no sea coordinator en otra inmobiliaria (límite de 1)
  if exists (
    select 1 from public.real_estate_agents 
    where profile_id = auth.uid() 
    and role = 'coordinator'
  ) then
    raise exception 'Ya eres coordinador de otra inmobiliaria';
  end if;
  
  -- Insertar al creador como coordinador de la nueva inmobiliaria
  -- Usamos security definer implícito de la función
  insert into public.real_estate_agents (real_estate_id, profile_id, role)
  values (new.id, auth.uid(), 'coordinator');
  
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_real_estate_created on public.real_estates;
create trigger on_real_estate_created
  after insert on public.real_estates
  for each row execute procedure public.handle_new_real_estate();