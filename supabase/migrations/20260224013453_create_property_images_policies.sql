alter table public.property_images enable row level security;
create or replace function public.can_manage_property_image(
  p_image_id uuid,
  p_user_id uuid default auth.uid()
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_property_id uuid;
begin
  select property_id
  into v_property_id
  from public.property_images
  where id = p_image_id;

  if v_property_id is null then
    return false;
  end if;

  return public.can_manage_property(v_property_id, p_user_id);
end;
$$;

create policy "Images: viewable by everyone" on public.property_images for
select using (true);

create policy "Users can insert images into manageable properties" on public.property_images for
insert
    to authenticated
with
    check (
        public.can_manage_property (property_id)
    );

create policy "Users can update manageable property images" on public.property_images for
update to authenticated using (
    public.can_manage_property_image (id)
)
with
    check (
        public.can_manage_property (property_id)
    );

create policy "Users can delete manageable property images" on public.property_images for delete to authenticated using (
    public.can_manage_property_image (id)
);

grant all on public.property_images to authenticated;