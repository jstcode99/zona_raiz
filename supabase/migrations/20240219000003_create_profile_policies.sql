alter table public.profiles enable row level security;

create or replace function public.get_user_role()
returns text
language sql
stable
as $$
  select auth.jwt() ->> 'role';
$$;

create policy "Profile: Users read own profile" on public.profiles for
select to authenticated using (
        auth.uid () = id
        or public.get_user_role () = 'admin'
    );

create policy "Profile: System can create profiles" on public.profiles for
insert
    to authenticated
with
    check (auth.uid () = id);

create policy "Profile: Users update own profile" on public.profiles for
update to authenticated using (auth.uid () = id)
with
    check (auth.uid () = id);

create policy "Profile: Admins can update any profile" on public.profiles for
update to authenticated using (
    public.get_user_role () = 'admin'
);

create policy "Profile: Admins can delete profiles" on public.profiles for delete to authenticated using (
    public.get_user_role () = 'admin'
);

grant all on public.profiles to authenticated;