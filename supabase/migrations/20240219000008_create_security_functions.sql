create or replace function public.is_admin(user_id uuid)
returns boolean
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from public.profiles 
    where id = user_id 
      and role = 'admin'
  );
end;
$$ language plpgsql;

create or replace function public.current_is_admin()
returns boolean
as $$
begin
  return public.is_admin(auth.uid());
end;
$$ language plpgsql security definer;

create or replace function public.has_role(user_id uuid, required_role text)
returns boolean
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 from public.profiles 
    where id = user_id 
      and role = required_role
  );
end;
$$ language plpgsql;