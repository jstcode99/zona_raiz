alter table public.real_estates enable row level security;

create policy "Real estate: All can read real estates" on public.real_estates for
select using (true);

create policy "Real estate: User admin or coordinator can create real estates" on public.real_estates for
insert
with
    check (
        exists (
            select 1
            from public.profiles
            where
                id = auth.uid ()
                and role in ('coordinator', 'admin')
        )
    );

create policy "Real estate: User admin or coordinator can update real estates" on public.real_estates for
update using (
    public.can_manage_real_estate (id, auth.uid ())
)
with
    check (
        public.can_manage_real_estate (id, auth.uid ())
    );

create policy "Real estate: Admin only can delete real estates" on public.real_estates for delete using (public.is_admin (auth.uid ()));

grant all on public.real_estates to authenticated;