-- Add a reversible lifecycle for technicians. Archiving is available to
-- active main admins and owners; permanent purge is restricted to owners.
alter table public.technician
  add column archived_at timestamptz,
  add column archived_by uuid references public.user_profile(id) on delete set null,
  add column active_before_archive boolean;

create index technician_archived_at_idx
  on public.technician (archived_at);

-- Archive metadata can only be changed through the security-definer RPCs.
-- Existing profile editing remains available through explicit column grants.
revoke update on public.technician from anon, authenticated;

grant update (
  active,
  name,
  alias,
  notes,
  jobs_per_day,
  home_zip_code,
  gas,
  commercial,
  can_service_built_in,
  can_service_stacked_washer,
  can_service_stacked_dryer
) on public.technician to authenticated;

create or replace function public.archive_technician(
  p_technician_id uuid
)
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
      and up.role = any (
        array[
          'main_admin'::public.app_role,
          'owner'::public.app_role
        ]
      )
  ) then
    raise exception 'Insufficient permissions to archive technicians'
      using errcode = '42501';
  end if;

  update public.technician
  set archived_at = statement_timestamp(),
      archived_by = auth.uid(),
      active_before_archive = active,
      active = false
  where id = p_technician_id
    and archived_at is null
  returning id into v_archived_id;

  if v_archived_id is null then
    if exists (
      select 1 from public.technician where id = p_technician_id
    ) then
      raise exception 'Technician is already archived'
        using errcode = '22023';
    end if;

    raise exception 'Technician not found'
      using errcode = 'P0002';
  end if;

  return v_archived_id;
end;
$$;

create or replace function public.restore_technician(
  p_technician_id uuid
)
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
      and up.role = any (
        array[
          'main_admin'::public.app_role,
          'owner'::public.app_role
        ]
      )
  ) then
    raise exception 'Insufficient permissions to restore technicians'
      using errcode = '42501';
  end if;

  update public.technician
  set active = coalesce(active_before_archive, false),
      archived_at = null,
      archived_by = null,
      active_before_archive = null
  where id = p_technician_id
    and archived_at is not null
  returning id into v_restored_id;

  if v_restored_id is null then
    if exists (
      select 1 from public.technician where id = p_technician_id
    ) then
      raise exception 'Technician is not archived'
        using errcode = '22023';
    end if;

    raise exception 'Technician not found'
      using errcode = 'P0002';
  end if;

  return v_restored_id;
end;
$$;

create or replace function public.purge_technician(
  p_technician_id uuid
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
      and up.role = 'owner'::public.app_role
  ) then
    raise exception 'Insufficient permissions to permanently purge technicians'
      using errcode = '42501';
  end if;

  delete from public.technician
  where id = p_technician_id
    and archived_at is not null
  returning id into v_deleted_id;

  if v_deleted_id is null then
    if exists (
      select 1 from public.technician where id = p_technician_id
    ) then
      raise exception 'Technician must be archived before permanent purge'
        using errcode = '22023';
    end if;

    raise exception 'Technician not found'
      using errcode = 'P0002';
  end if;

  return v_deleted_id;
end;
$$;

revoke execute on function public.archive_technician(uuid) from public, anon;
revoke execute on function public.restore_technician(uuid) from public, anon;
revoke execute on function public.purge_technician(uuid) from public, anon;

grant execute on function public.archive_technician(uuid) to authenticated;
grant execute on function public.restore_technician(uuid) to authenticated;
grant execute on function public.purge_technician(uuid) to authenticated;

-- Remove the old main-admin-accessible permanent deletion path.
drop function if exists public.delete_technician(uuid);

drop policy if exists "Authenticated users can read technician"
  on public.technician;

create policy "Authenticated users can read available technicians"
on public.technician
for select
to authenticated
using (
  archived_at is null
  or public.current_user_has_role('main_admin'::public.app_role)
);
