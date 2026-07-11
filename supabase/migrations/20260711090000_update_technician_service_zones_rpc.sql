-- 1. Create private schema for security helpers
create schema if not exists private;

revoke all on schema private from public;
revoke all on schema private from anon;

grant usage on schema private to authenticated;


-- 2. Auth helper for technician service zones management
create or replace function private.current_user_can_manage_technician_service_zones()
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

revoke execute on function private.current_user_can_manage_technician_service_zones()
from public, anon;

grant execute on function private.current_user_can_manage_technician_service_zones()
to authenticated;


-- 3. Ensure RLS is enabled
alter table public.technician_service_zone enable row level security;


-- 4. Guard against inactive zone assignments before enforcing RPC validation
do $$
begin
  if exists (
    select 1
    from public.technician_service_zone tsz
    left join public.service_zone sz on sz.id = tsz.zone_id
    where sz.id is null
      or sz.active is not true
  ) then
    raise exception
      'Cannot create technician service zone RPC: invalid or inactive zone assignments still exist';
  end if;
end;
$$;


-- 5. RLS SELECT policy
drop policy if exists "Authenticated users can read technician_service_zone"
on public.technician_service_zone;

drop policy if exists "Authenticated users can read technician service zones"
on public.technician_service_zone;

create policy "Authenticated users can read technician service zones"
on public.technician_service_zone
for select
to authenticated
using (true);


-- 6. RLS INSERT policy
drop policy if exists "Active admins can insert technician service zones"
on public.technician_service_zone;

create policy "Active admins can insert technician service zones"
on public.technician_service_zone
for insert
to authenticated
with check (
  (select private.current_user_can_manage_technician_service_zones())
);


-- 7. RLS DELETE policy
drop policy if exists "Active admins can delete technician service zones"
on public.technician_service_zone;

create policy "Active admins can delete technician service zones"
on public.technician_service_zone
for delete
to authenticated
using (
  (select private.current_user_can_manage_technician_service_zones())
);


-- 8. Table privileges
revoke all on table public.technician_service_zone from anon;
revoke all on table public.technician_service_zone from authenticated;

grant select, insert, delete
on table public.technician_service_zone
to authenticated;


-- 9. Drop old RPC before changing return type
drop function if exists public.update_technician_service_zones(
  uuid,
  uuid[],
  uuid[]
);


-- 10. Recreate RPC and return current saved service zones
create function public.update_technician_service_zones(
  p_technician_id uuid,
  p_added_zone_ids uuid[] default '{}'::uuid[],
  p_removed_zone_ids uuid[] default '{}'::uuid[]
)
returns setof public.technician_service_zone
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_added_zone_ids uuid[] := coalesce(p_added_zone_ids, '{}'::uuid[]);
  v_removed_zone_ids uuid[] := coalesce(p_removed_zone_ids, '{}'::uuid[]);
begin
  if not (select private.current_user_can_manage_technician_service_zones()) then
    raise exception 'Insufficient permissions'
      using errcode = '42501';
  end if;

  -- Validate duplicate zone ids inside the added payload.
  if exists (
    select 1
    from unnest(v_added_zone_ids) as added(zone_id)
    group by added.zone_id
    having count(*) > 1
  ) then
    raise exception 'Invalid technician service zone payload: duplicate zone ids'
      using errcode = '23505';
  end if;

  -- Validate every added zone exists and is active.
  if exists (
    select 1
    from unnest(v_added_zone_ids) as added(zone_id)
    left join public.service_zone sz on sz.id = added.zone_id
    where added.zone_id is null
      or sz.id is null
      or sz.active is not true
  ) then
    raise exception 'Invalid technician service zone payload: zone does not exist or is inactive'
      using errcode = '22023';
  end if;

  delete from public.technician_service_zone
  where technician_id = p_technician_id
    and zone_id = any(v_removed_zone_ids);

  insert into public.technician_service_zone (
    technician_id,
    zone_id
  )
  select
    p_technician_id,
    added.zone_id
  from unnest(v_added_zone_ids) as added(zone_id);

  return query
  select tsz.*
  from public.technician_service_zone tsz
  where tsz.technician_id = p_technician_id
  order by tsz.zone_id;
end;
$$;


-- 11. Function privileges
revoke execute on function public.update_technician_service_zones(uuid, uuid[], uuid[])
from public, anon;

grant execute on function public.update_technician_service_zones(uuid, uuid[], uuid[])
to authenticated;
