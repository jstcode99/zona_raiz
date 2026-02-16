create or replace function public.soft_delete_row(_table text, _id uuid)
returns void
language plpgsql
security definer
as $$
begin
  execute format(
    'update %I set deleted_at = now() where id = $1',
    _table
  ) using _id;
end;
$$;
