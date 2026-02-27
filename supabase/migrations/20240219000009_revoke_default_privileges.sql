revoke insert, update, delete on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;

-- Revocar privilegios en storage
revoke insert, update, delete on all tables in schema storage from anon, authenticated;

alter default privileges in schema public
  revoke insert, update, delete on tables from anon, authenticated;
  
alter default privileges in schema storage
  revoke insert, update, delete on tables from anon, authenticated;