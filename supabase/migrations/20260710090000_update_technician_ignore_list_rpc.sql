-- 1. Create private schema for security helpers
create schema if not exists private;

revoke all on schema private from public;
revoke all on schema private from anon;

grant usage on schema private to authenticated;


-- 2. Auth helper for technician ignore list management
create or replace function private.current_user_can_manage_technician_ignore_list()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.user_profile up
    where up.id = auth.uid()
      and up.active = true
      and up.role = any (
        array[
          'secondary_admin'::public.app_role,
          'main_admin'::public.app_role,
          'owner'::public.app_role
        ]
      )
  );
$$;

revoke execute on function private.current_user_can_manage_technician_ignore_list()
from public, anon;

grant execute on function private.current_user_can_manage_technician_ignore_list()
to authenticated;


-- 3. Ensure RLS is enabled
alter table public.technician_ignore_list enable row level security;


-- 4. Backfill unit_id from specific_issue where issue context exists
update public.technician_ignore_list til
set unit_id = si.unit_id
from public.specific_issue si
where til.specific_issue_id = si.id
  and til.unit_id is distinct from si.unit_id;


-- 5. Guard before adding constraints
do $$
begin
  if exists (
    select 1
    from public.technician_ignore_list
    where num_nonnulls(unit_id, brand_id, specific_issue_id) = 0
  ) then
    raise exception
      'Cannot add technician_ignore_list_at_least_one_criterion: empty ignore list rows still exist';
  end if;

  if exists (
    select 1
    from public.technician_ignore_list til
    join public.specific_issue si on si.id = til.specific_issue_id
    where til.specific_issue_id is not null
      and til.unit_id is distinct from si.unit_id
  ) then
    raise exception
      'Cannot normalize technician_ignore_list: specific issue rows still have invalid unit_id';
  end if;
end;
$$;


-- 6. Dedupe existing exact duplicate ignore rules
with ranked as (
  select
    id,
    row_number() over (
      partition by technician_id, unit_id, brand_id, specific_issue_id
      order by id
    ) as rn
  from public.technician_ignore_list
)
delete from public.technician_ignore_list til
using ranked r
where til.id = r.id
  and r.rn > 1;


-- 7. Recreate CHECK constraints
alter table public.technician_ignore_list
drop constraint if exists technician_ignore_list_at_least_one_criterion;

alter table public.technician_ignore_list
add constraint technician_ignore_list_at_least_one_criterion
check (num_nonnulls(unit_id, brand_id, specific_issue_id) >= 1);

alter table public.technician_ignore_list
drop constraint if exists technician_ignore_list_issue_requires_unit;

alter table public.technician_ignore_list
add constraint technician_ignore_list_issue_requires_unit
check (specific_issue_id is null or unit_id is not null);


-- 8. Normalize and validate issue/unit consistency on writes
create or replace function private.normalize_technician_ignore_list_item()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_issue_unit_id uuid;
begin
  if new.specific_issue_id is not null then
    select si.unit_id
    into v_issue_unit_id
    from public.specific_issue si
    where si.id = new.specific_issue_id
      and si.active is true;

    if v_issue_unit_id is null then
      raise exception 'Invalid technician ignore list item: specific issue does not exist or is inactive'
        using errcode = '22023';
    end if;

    if new.unit_id is not null and new.unit_id <> v_issue_unit_id then
      raise exception 'Invalid technician ignore list item: specific issue belongs to another unit'
        using errcode = '22023';
    end if;

    new.unit_id := v_issue_unit_id;
  end if;

  if new.unit_id is null
    and new.brand_id is null
    and new.specific_issue_id is null
  then
    raise exception 'Invalid technician ignore list item: at least one criterion is required'
      using errcode = '22023';
  end if;

  return new;
end;
$$;

revoke execute on function private.normalize_technician_ignore_list_item()
from public, anon, authenticated;

drop trigger if exists normalize_technician_ignore_list_item
on public.technician_ignore_list;

create trigger normalize_technician_ignore_list_item
before insert or update
on public.technician_ignore_list
for each row
execute function private.normalize_technician_ignore_list_item();


-- 9. Recreate unique exact-rule index. NULLS NOT DISTINCT preserves null = wildcard identity.
drop index if exists public.technician_ignore_list_unique_rule;

create unique index technician_ignore_list_unique_rule
on public.technician_ignore_list (
  technician_id,
  unit_id,
  brand_id,
  specific_issue_id
)
nulls not distinct;


-- 10. RLS SELECT policy
drop policy if exists "Authenticated users can read technician_ignore_list"
on public.technician_ignore_list;

drop policy if exists "Authenticated users can read technician ignore list"
on public.technician_ignore_list;

create policy "Authenticated users can read technician ignore list"
on public.technician_ignore_list
for select
to authenticated
using (true);


-- 11. RLS INSERT policy
drop policy if exists "Active admins can insert technician ignore list"
on public.technician_ignore_list;

create policy "Active admins can insert technician ignore list"
on public.technician_ignore_list
for insert
to authenticated
with check (
  (select private.current_user_can_manage_technician_ignore_list())
);


-- 12. RLS DELETE policy
drop policy if exists "Active admins can delete technician ignore list"
on public.technician_ignore_list;

create policy "Active admins can delete technician ignore list"
on public.technician_ignore_list
for delete
to authenticated
using (
  (select private.current_user_can_manage_technician_ignore_list())
);


-- 13. Table privileges
revoke all on table public.technician_ignore_list from anon;
revoke all on table public.technician_ignore_list from authenticated;

grant select, insert, delete
on table public.technician_ignore_list
to authenticated;


-- 14. Drop old RPC before changing return type
drop function if exists public.update_technician_ignore_list(
  uuid,
  jsonb,
  uuid[]
);


-- 15. Recreate RPC and return current saved ignore list
create function public.update_technician_ignore_list(
  p_technician_id uuid,
  p_added_items jsonb default '[]'::jsonb,
  p_removed_item_ids uuid[] default '{}'::uuid[]
)
returns setof public.technician_ignore_list
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_added_items jsonb := coalesce(p_added_items, '[]'::jsonb);
  v_removed_item_ids uuid[] := coalesce(p_removed_item_ids, '{}'::uuid[]);
begin
  if not (select private.current_user_can_manage_technician_ignore_list()) then
    raise exception 'Insufficient permissions'
      using errcode = '42501';
  end if;

  if jsonb_typeof(v_added_items) <> 'array' then
    raise exception 'p_added_items must be a JSON array'
      using errcode = '22023';
  end if;

  -- Validate at least one criterion in each payload row.
  if exists (
    select 1
    from jsonb_to_recordset(v_added_items) as item(
      unit_id uuid,
      brand_id uuid,
      specific_issue_id uuid
    )
    where num_nonnulls(item.unit_id, item.brand_id, item.specific_issue_id) = 0
  ) then
    raise exception 'Invalid technician ignore list payload: each item must have at least one criterion'
      using errcode = '22023';
  end if;

  -- Validate unit exists and is active when provided.
  if exists (
    select 1
    from jsonb_to_recordset(v_added_items) as item(
      unit_id uuid,
      brand_id uuid,
      specific_issue_id uuid
    )
    left join public.unit u on u.id = item.unit_id
    where item.unit_id is not null
      and (
        u.id is null
        or u.active is not true
      )
  ) then
    raise exception 'Invalid technician ignore list payload: unit does not exist or is inactive'
      using errcode = '22023';
  end if;

  -- Validate brand exists and is active when provided.
  if exists (
    select 1
    from jsonb_to_recordset(v_added_items) as item(
      unit_id uuid,
      brand_id uuid,
      specific_issue_id uuid
    )
    left join public.brand b on b.id = item.brand_id
    where item.brand_id is not null
      and (
        b.id is null
        or b.active is not true
      )
  ) then
    raise exception 'Invalid technician ignore list payload: brand does not exist or is inactive'
      using errcode = '22023';
  end if;

  -- Validate specific issue exists, is active, and matches unit when unit is provided.
  if exists (
    select 1
    from jsonb_to_recordset(v_added_items) as item(
      unit_id uuid,
      brand_id uuid,
      specific_issue_id uuid
    )
    left join public.specific_issue si on si.id = item.specific_issue_id
    where item.specific_issue_id is not null
      and (
        si.id is null
        or si.active is not true
        or (
          item.unit_id is not null
          and si.unit_id <> item.unit_id
        )
      )
  ) then
    raise exception 'Invalid technician ignore list payload: specific issue does not exist, is inactive, or belongs to another unit'
      using errcode = '22023';
  end if;

  -- Validate duplicate rules inside this payload after issue -> unit normalization.
  if exists (
    with payload as (
      select
        coalesce(item.unit_id, si.unit_id) as unit_id,
        item.brand_id,
        item.specific_issue_id
      from jsonb_to_recordset(v_added_items) as item(
        unit_id uuid,
        brand_id uuid,
        specific_issue_id uuid
      )
      left join public.specific_issue si on si.id = item.specific_issue_id
    )
    select 1
    from payload
    group by unit_id, brand_id, specific_issue_id
    having count(*) > 1
  ) then
    raise exception 'Invalid technician ignore list payload: duplicate ignore list items'
      using errcode = '23505';
  end if;

  delete from public.technician_ignore_list
  where technician_id = p_technician_id
    and id = any(v_removed_item_ids);

  insert into public.technician_ignore_list (
    technician_id,
    unit_id,
    brand_id,
    specific_issue_id
  )
  select
    p_technician_id,
    coalesce(item.unit_id, si.unit_id),
    item.brand_id,
    item.specific_issue_id
  from jsonb_to_recordset(v_added_items) as item(
    unit_id uuid,
    brand_id uuid,
    specific_issue_id uuid
  )
  left join public.specific_issue si on si.id = item.specific_issue_id;

  return query
  select til.*
  from public.technician_ignore_list til
  where til.technician_id = p_technician_id
  order by
    til.unit_id nulls first,
    til.brand_id nulls first,
    til.specific_issue_id nulls first,
    til.id;
end;
$$;


-- 16. Function privileges
revoke execute on function public.update_technician_ignore_list(uuid, jsonb, uuid[])
from public, anon;

grant execute on function public.update_technician_ignore_list(uuid, jsonb, uuid[])
to authenticated;
