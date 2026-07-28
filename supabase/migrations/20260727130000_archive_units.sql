begin;

alter table public.unit
  add column archived_at timestamptz,
  add column archived_by uuid references public.user_profile(id) on delete set null,
  add column active_before_archive boolean;

create index unit_archived_at_idx
  on public.unit (archived_at);

-- Archive metadata is controlled exclusively by the lifecycle RPCs.
revoke update on public.unit from anon, authenticated;

grant update (
  active,
  name,
  slug,
  display_order,
  is_built_in,
  can_be_stacked,
  can_be_gas,
  can_be_commercial
) on public.unit to authenticated;

create or replace function public.archive_unit(p_unit_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_archived_id uuid;
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
    raise exception 'Insufficient permissions to archive units'
      using errcode = '42501';
  end if;

  update public.unit
  set archived_at = statement_timestamp(),
      archived_by = auth.uid(),
      active_before_archive = active,
      active = false
  where id = p_unit_id
    and archived_at is null
  returning id into v_archived_id;

  if v_archived_id is null then
    if exists (select 1 from public.unit where id = p_unit_id) then
      raise exception 'Unit is already archived'
        using errcode = '22023';
    end if;

    raise exception 'Unit not found'
      using errcode = 'P0002';
  end if;

  return v_archived_id;
end;
$$;

create or replace function public.restore_unit(p_unit_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_restored_id uuid;
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
    raise exception 'Insufficient permissions to restore units'
      using errcode = '42501';
  end if;

  update public.unit
  set active = coalesce(active_before_archive, false),
      archived_at = null,
      archived_by = null,
      active_before_archive = null
  where id = p_unit_id
    and archived_at is not null
  returning id into v_restored_id;

  if v_restored_id is null then
    if exists (select 1 from public.unit where id = p_unit_id) then
      raise exception 'Unit is not archived'
        using errcode = '22023';
    end if;

    raise exception 'Unit not found'
      using errcode = 'P0002';
  end if;

  return v_restored_id;
end;
$$;

create or replace function public.purge_unit(p_unit_id uuid)
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
    raise exception 'Insufficient permissions to permanently purge units'
      using errcode = '42501';
  end if;

  delete from public.unit
  where id = p_unit_id
    and archived_at is not null
  returning id into v_deleted_id;

  if v_deleted_id is null then
    if exists (select 1 from public.unit where id = p_unit_id) then
      raise exception 'Unit must be archived before permanent purge'
        using errcode = '22023';
    end if;

    raise exception 'Unit not found'
      using errcode = 'P0002';
  end if;

  return v_deleted_id;
end;
$$;

revoke execute on function public.archive_unit(uuid) from public, anon;
revoke execute on function public.restore_unit(uuid) from public, anon;
revoke execute on function public.purge_unit(uuid) from public, anon;

grant execute on function public.archive_unit(uuid) to authenticated;
grant execute on function public.restore_unit(uuid) to authenticated;
grant execute on function public.purge_unit(uuid) to authenticated;

drop policy if exists "Authenticated users can read unit"
  on public.unit;
drop policy if exists "Active users can read units"
  on public.unit;

create policy "Authenticated users can read available units"
on public.unit
for select
to authenticated
using (
  archived_at is null
  or public.current_user_has_role('main_admin'::public.app_role)
);

drop policy if exists "Main admins can update units"
  on public.unit;

create policy "Main admins can update available units"
on public.unit
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

commit;
