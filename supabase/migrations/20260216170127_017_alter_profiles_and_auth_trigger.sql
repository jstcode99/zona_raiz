alter table public.profiles
add column phone text;
alter table public.profiles
add constraint profiles_phone_unique unique (phone);
