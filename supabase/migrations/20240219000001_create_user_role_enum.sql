-- Enum para roles de usuario (type-safe)
create type public.user_role as enum ('admin', 'agent', 'client', 'coordinator');

comment on type public.user_role is 'Roles disponibles para usuarios en el sistema';