create table if not exists public.publication_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,

  max_active_listings int,
  featured_slots int,
  ad_priority int default 0,

  duration_days int not null,
  price numeric default 0,
  currency text default 'USD',

  is_active boolean default true,
  created_at timestamptz default now(),
  deleted_at timestamptz
);


create table if not exists public.real_estate_plan_subscriptions (
  id uuid primary key default gen_random_uuid(),
  real_estate_id uuid references public.real_estates(id) on delete cascade,
  plan_id uuid references public.publication_plans(id),

  starts_at timestamptz default now(),
  expires_at timestamptz,
  is_active boolean default true,

  created_at timestamptz default now(),
  deleted_at timestamptz
);


create index if not exists idx_plans_active
on public.publication_plans(is_active)
where deleted_at is null;

create index if not exists idx_re_plan_active
on public.real_estate_plan_subscriptions(real_estate_id, is_active)
where deleted_at is null;


create or replace function public.assign_plan_to_real_estate(
  p_real_estate_id uuid,
  p_plan_id uuid
)
returns public.real_estate_plan_subscriptions
language plpgsql
security definer
as $$
declare
  v_plan public.publication_plans;
  v_sub public.real_estate_plan_subscriptions;
begin
  select * into v_plan
  from public.publication_plans
  where id = p_plan_id
  and is_active = true
  and deleted_at is null;

  if not found then
    raise exception 'Plan not available';
  end if;

  insert into public.real_estate_plan_subscriptions(
    real_estate_id,
    plan_id,
    starts_at,
    expires_at
  )
  values (
    p_real_estate_id,
    p_plan_id,
    now(),
    now() + make_interval(days => v_plan.duration_days)
  )
  returning * into v_sub;

  return v_sub;
end;
$$;


alter table public.publication_plans enable row level security;
alter table public.real_estate_plan_subscriptions enable row level security;

create policy "Public read active plans"
on public.publication_plans
for select
using (is_active = true and deleted_at is null);

create policy "Public read active subscriptions"
on public.real_estate_plan_subscriptions
for select
using (is_active = true and deleted_at is null);
