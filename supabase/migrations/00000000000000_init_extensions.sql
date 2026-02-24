-- Habilitar extensiones necesarias primero
create extension if not exists "uuid-ossp" with schema extensions;
create extension if not exists "pgcrypto" with schema extensions;
create extension if not exists 'pg_trgm' with schema extensions;
