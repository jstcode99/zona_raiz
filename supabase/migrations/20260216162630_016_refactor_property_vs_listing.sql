alter table public.properties
drop column if exists title,
drop column if exists slug,
drop column if exists meta_title,
drop column if exists meta_description,
drop column if exists description,
drop column if exists price,
drop column if exists currency;