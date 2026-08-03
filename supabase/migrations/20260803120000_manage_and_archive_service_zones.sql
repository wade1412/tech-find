begin;

alter table public.service_zone
  add column archived_at timestamptz,
  add column archived_by uuid references public.user_profile(id) on delete set null,
  add column active_before_archive boolean;

create index service_zone_archived_at_idx
  on public.service_zone (archived_at);

-- Lifecycle metadata is controlled exclusively by the archive RPCs.
revoke insert, update, delete on public.service_zone from anon, authenticated;

grant insert (
  name,
  slug,
  active,
  display_order
) on public.service_zone to authenticated;

grant update (
  name,
  slug,
  active,
  display_order
) on public.service_zone to authenticated;

drop policy if exists "Authenticated users can read service_zone"
  on public.service_zone;
drop policy if exists "Active users can read service zones"
  on public.service_zone;
drop policy if exists "Active users can read available service zones"
  on public.service_zone;

create policy "Active users can read available service zones"
on public.service_zone
for select
to authenticated
using (
  public.current_app_role() is not null
  and (
    archived_at is null
    or public.current_user_has_role('main_admin'::public.app_role)
  )
);

create policy "Main admins can create service zones"
on public.service_zone
for insert
to authenticated
with check (public.current_user_has_role('main_admin'::public.app_role));

create policy "Main admins can update available service zones"
on public.service_zone
for update
to authenticated
using (
  archived_at is null
  and public.current_user_has_role('main_admin'::public.app_role)
)
with check (
  archived_at is null
  and public.current_user_has_role('main_admin'::public.app_role)
);

-- Archived zones keep their technician assignments for a lossless restore,
-- but non-management users must not receive those archived relationships.
drop policy if exists "Authenticated users can read technician_service_zone"
  on public.technician_service_zone;
drop policy if exists "Authenticated users can read technician service zones"
  on public.technician_service_zone;
drop policy if exists "Active users can read technician service zones"
  on public.technician_service_zone;
drop policy if exists "Active users can read available technician service zones"
  on public.technician_service_zone;

create policy "Active users can read available technician service zones"
on public.technician_service_zone
for select
to authenticated
using (
  public.current_app_role() is not null
  and (
    exists (
      select 1
      from public.service_zone sz
      where sz.id = technician_service_zone.zone_id
        and sz.archived_at is null
    )
    or public.current_user_has_role('main_admin'::public.app_role)
  )
);

-- Enforce assignability even when a client writes the junction table directly.
drop policy if exists "Active admins can insert technician service zones"
  on public.technician_service_zone;

create policy "Active admins can insert available technician service zones"
on public.technician_service_zone
for insert
to authenticated
with check (
  (select private.current_user_can_manage_technician_service_zones())
  and exists (
    select 1
    from public.service_zone sz
    where sz.id = technician_service_zone.zone_id
      and sz.active is true
      and sz.archived_at is null
  )
);

create or replace function public.archive_service_zone(
  p_service_zone_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_zone public.service_zone%rowtype;
begin
  if not exists (
    select 1
    from public.user_profile up
    where up.id = auth.uid()
      and up.active is true
      and up.archived_at is null
      and up.role = any (
        array[
          'main_admin'::public.app_role,
          'owner'::public.app_role
        ]
      )
  ) then
    raise exception 'Insufficient permissions to archive service zones'
      using errcode = '42501';
  end if;

  select *
  into v_zone
  from public.service_zone
  where id = p_service_zone_id
  for update;

  if not found then
    raise exception 'Service zone not found'
      using errcode = 'P0002';
  end if;

  if v_zone.archived_at is not null then
    raise exception 'Service zone is already archived'
      using errcode = '22023';
  end if;

  update public.service_zone
  set archived_at = statement_timestamp(),
      archived_by = auth.uid(),
      active_before_archive = active,
      active = false
  where id = p_service_zone_id;

  return p_service_zone_id;
end;
$$;

create or replace function public.restore_service_zone(
  p_service_zone_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_zone public.service_zone%rowtype;
begin
  if not exists (
    select 1
    from public.user_profile up
    where up.id = auth.uid()
      and up.active is true
      and up.archived_at is null
      and up.role = any (
        array[
          'main_admin'::public.app_role,
          'owner'::public.app_role
        ]
      )
  ) then
    raise exception 'Insufficient permissions to restore service zones'
      using errcode = '42501';
  end if;

  select *
  into v_zone
  from public.service_zone
  where id = p_service_zone_id
  for update;

  if not found then
    raise exception 'Service zone not found'
      using errcode = 'P0002';
  end if;

  if v_zone.archived_at is null then
    raise exception 'Service zone is not archived'
      using errcode = '22023';
  end if;

  update public.service_zone
  set active = coalesce(active_before_archive, false),
      archived_at = null,
      archived_by = null,
      active_before_archive = null
  where id = p_service_zone_id;

  return p_service_zone_id;
end;
$$;

create or replace function public.purge_service_zone(
  p_service_zone_id uuid
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_deleted_id uuid;
begin
  if not exists (
    select 1
    from public.user_profile up
    where up.id = auth.uid()
      and up.active is true
      and up.archived_at is null
      and up.role = 'owner'::public.app_role
  ) then
    raise exception 'Insufficient permissions to permanently purge service zones'
      using errcode = '42501';
  end if;

  delete from public.service_zone
  where id = p_service_zone_id
    and archived_at is not null
  returning id into v_deleted_id;

  if v_deleted_id is null then
    if exists (
      select 1 from public.service_zone
      where id = p_service_zone_id
    ) then
      raise exception 'Service zone must be archived before permanent purge'
        using errcode = '22023';
    end if;

    raise exception 'Service zone not found'
      using errcode = 'P0002';
  end if;

  return v_deleted_id;
end;
$$;

-- Keep the existing technician assignment RPC, adding archive awareness.
create or replace function public.update_technician_service_zones(
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

  if exists (
    select 1
    from unnest(v_added_zone_ids) as added(zone_id)
    group by added.zone_id
    having count(*) > 1
  ) then
    raise exception 'Invalid technician service zone payload: duplicate zone ids'
      using errcode = '23505';
  end if;

  if exists (
    select 1
    from unnest(v_added_zone_ids) as added(zone_id)
    left join public.service_zone sz on sz.id = added.zone_id
    where added.zone_id is null
      or sz.id is null
      or sz.active is not true
      or sz.archived_at is not null
  ) then
    raise exception 'Invalid technician service zone payload: zone does not exist, is inactive, or is archived'
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

revoke execute on function public.archive_service_zone(uuid)
  from public, anon;
revoke execute on function public.restore_service_zone(uuid)
  from public, anon;
revoke execute on function public.purge_service_zone(uuid)
  from public, anon;
revoke execute on function public.update_technician_service_zones(uuid, uuid[], uuid[])
  from public, anon;

grant execute on function public.archive_service_zone(uuid)
  to authenticated;
grant execute on function public.restore_service_zone(uuid)
  to authenticated;
grant execute on function public.purge_service_zone(uuid)
  to authenticated;
grant execute on function public.update_technician_service_zones(uuid, uuid[], uuid[])
  to authenticated;

commit;
