begin;

alter table public.specific_issue
  add column archived_at timestamptz,
  add column archived_by uuid references public.user_profile(id) on delete set null,
  add column active_before_archive boolean;

create index specific_issue_archived_at_idx
  on public.specific_issue (archived_at);

revoke update on public.specific_issue from anon, authenticated;

grant update (
  active,
  name,
  slug,
  unit_id
) on public.specific_issue to authenticated;

drop policy if exists "Authenticated users can read specific_issue"
  on public.specific_issue;

create policy "Authenticated users can read available specific issues"
on public.specific_issue
for select
to authenticated
using (
  archived_at is null
  or public.current_user_has_role('main_admin'::public.app_role)
);

create policy "Main admins can create specific issues"
on public.specific_issue
for insert
to authenticated
with check (
  archived_at is null
  and public.current_user_has_role('main_admin'::public.app_role)
  and exists (
    select 1
    from public.unit u
    where u.id = unit_id
      and u.archived_at is null
  )
);

create policy "Main admins can update available specific issues"
on public.specific_issue
for update
to authenticated
using (
  archived_at is null
  and public.current_user_has_role('main_admin'::public.app_role)
)
with check (
  archived_at is null
  and public.current_user_has_role('main_admin'::public.app_role)
  and exists (
    select 1
    from public.unit u
    where u.id = unit_id
      and u.archived_at is null
  )
);

create or replace function public.archive_specific_issue(
  p_specific_issue_id uuid
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
      and up.archived_at is null
      and up.role = any (
        array[
          'main_admin'::public.app_role,
          'owner'::public.app_role
        ]
      )
  ) then
    raise exception 'Insufficient permissions to archive specific issues'
      using errcode = '42501';
  end if;

  update public.specific_issue si
  set archived_at = statement_timestamp(),
      archived_by = auth.uid(),
      active_before_archive = si.active,
      active = false
  where si.id = p_specific_issue_id
    and si.archived_at is null
    and exists (
      select 1
      from public.unit u
      where u.id = si.unit_id
        and u.archived_at is null
    )
  returning si.id into v_archived_id;

  if v_archived_id is null then
    if exists (
      select 1
      from public.specific_issue si
      join public.unit u on u.id = si.unit_id
      where si.id = p_specific_issue_id
        and u.archived_at is not null
    ) then
      raise exception 'Cannot archive a specific issue while its unit is archived'
        using errcode = '22023';
    end if;

    if exists (
      select 1 from public.specific_issue
      where id = p_specific_issue_id
    ) then
      raise exception 'Specific issue is already archived'
        using errcode = '22023';
    end if;

    raise exception 'Specific issue not found'
      using errcode = 'P0002';
  end if;

  return v_archived_id;
end;
$$;

create or replace function public.restore_specific_issue(
  p_specific_issue_id uuid
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
      and up.archived_at is null
      and up.role = any (
        array[
          'main_admin'::public.app_role,
          'owner'::public.app_role
        ]
      )
  ) then
    raise exception 'Insufficient permissions to restore specific issues'
      using errcode = '42501';
  end if;

  update public.specific_issue si
  set active = coalesce(si.active_before_archive, false),
      archived_at = null,
      archived_by = null,
      active_before_archive = null
  where si.id = p_specific_issue_id
    and si.archived_at is not null
    and exists (
      select 1
      from public.unit u
      where u.id = si.unit_id
        and u.archived_at is null
    )
  returning si.id into v_restored_id;

  if v_restored_id is null then
    if exists (
      select 1
      from public.specific_issue si
      join public.unit u on u.id = si.unit_id
      where si.id = p_specific_issue_id
        and u.archived_at is not null
    ) then
      raise exception 'Restore the parent unit before restoring its specific issues'
        using errcode = '22023';
    end if;

    if exists (
      select 1 from public.specific_issue
      where id = p_specific_issue_id
    ) then
      raise exception 'Specific issue is not archived'
        using errcode = '22023';
    end if;

    raise exception 'Specific issue not found'
      using errcode = 'P0002';
  end if;

  return v_restored_id;
end;
$$;

create or replace function public.purge_specific_issue(
  p_specific_issue_id uuid
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
    raise exception 'Insufficient permissions to permanently purge specific issues'
      using errcode = '42501';
  end if;

  delete from public.specific_issue
  where id = p_specific_issue_id
    and archived_at is not null
  returning id into v_deleted_id;

  if v_deleted_id is null then
    if exists (
      select 1 from public.specific_issue
      where id = p_specific_issue_id
    ) then
      raise exception 'Specific issue must be archived before permanent purge'
        using errcode = '22023';
    end if;

    raise exception 'Specific issue not found'
      using errcode = 'P0002';
  end if;

  return v_deleted_id;
end;
$$;

revoke execute on function public.archive_specific_issue(uuid)
  from public, anon;
revoke execute on function public.restore_specific_issue(uuid)
  from public, anon;
revoke execute on function public.purge_specific_issue(uuid)
  from public, anon;

grant execute on function public.archive_specific_issue(uuid)
  to authenticated;
grant execute on function public.restore_specific_issue(uuid)
  to authenticated;
grant execute on function public.purge_specific_issue(uuid)
  to authenticated;

commit;
