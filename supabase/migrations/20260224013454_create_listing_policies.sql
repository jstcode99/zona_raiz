alter table public.listings enable row level security;

create policy "Listings: view active or own real estate" on public.listings for
select using (
        status = 'active'
        or public.can_manage_property (property_id)
    );

create policy "Listings: insertable by managers" on public.listings for
insert
with
    check (
        public.can_manage_property (property_id)
    );

create policy "Listings: updatable by managers" on public.listings for
update using (
    public.can_manage_property (property_id)
)
with
    check (
        public.can_manage_property (property_id)
    );

create policy "Listings: deletable by managers" on public.listings for delete using (
    public.can_manage_property (property_id)
);

alter table public.listing_views enable row level security;

create policy "Views: insertable by everyone" on public.listing_views for
insert
with
    check (true);

create policy "Views: readable by agents"
on public.listing_views
for select
using (
    exists (
        select 1
        from public.listings l
        join public.properties p on p.id = l.property_id
        join public.real_estate_agents a on a.real_estate_id = p.real_estate_id
        where l.id = listing_views.listing_id
        and a.profile_id = auth.uid()
    )
);

grant
select,
insert,
update,
delete on public.listings to authenticated;