begin;

alter table public.user_profile
  add column archived_at timestamptz,
  add column archived_by uuid references public.user_profile(id) on delete set null,
  add column active_before_archive boolean;

create index user_profile_archived_at_idx
  on public.user_profile (archived_at);

alter table public.user_management_audit
  drop constraint user_management_audit_operation_check;

alter table public.user_management_audit
  add constraint user_management_audit_operation_check
  check (operation in ('create', 'update', 'archive', 'restore', 'purge'));

create or replace function public.archive_user(p_user_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor public.user_profile%rowtype;
  v_target public.user_profile%rowtype;
  v_before jsonb;
begin
  select *
  into v_actor
  from public.user_profile
  where id = auth.uid()
    and active is true
    and archived_at is null
    and role = any (
      array[
        'main_admin'::public.app_role,
        'owner'::public.app_role
      ]
    );

  if not found then
    raise exception 'Insufficient permissions to archive users'
      using errcode = '42501';
  end if;

  select *
  into v_target
  from public.user_profile
  where id = p_user_id
  for update;

  if not found then
    raise exception 'User not found'
      using errcode = 'P0002';
  end if;

  if v_target.archived_at is not null then
    raise exception 'User is already archived'
      using errcode = '22023';
  end if;

  if v_target.id = v_actor.id then
    raise exception 'You cannot archive your own account'
      using errcode = '42501';
  end if;

  if v_actor.role = 'main_admin'::public.app_role
    and v_target.role <> all (
      array[
        'user'::public.app_role,
        'secondary_admin'::public.app_role
      ]
    )
  then
    raise exception 'Main admins can only archive User or Secondary Admin accounts'
      using errcode = '42501';
  end if;

  v_before := to_jsonb(v_target);

  update public.user_profile
  set archived_at = statement_timestamp(),
      archived_by = v_actor.id,
      active_before_archive = active,
      active = false
  where id = v_target.id
  returning * into v_target;

  update auth.users
  set banned_until = statement_timestamp() + interval '100 years',
      updated_at = statement_timestamp()
  where id = v_target.id;

  insert into public.user_management_audit (
    actor_id,
    target_user_id,
    operation,
    outcome,
    before_state,
    after_state
  )
  values (
    v_actor.id,
    v_target.id,
    'archive',
    'succeeded',
    v_before,
    to_jsonb(v_target)
  );

  return v_target.id;
end;
$$;

create or replace function public.restore_user(p_user_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor public.user_profile%rowtype;
  v_target public.user_profile%rowtype;
  v_before jsonb;
  v_restored_active boolean;
begin
  select *
  into v_actor
  from public.user_profile
  where id = auth.uid()
    and active is true
    and archived_at is null
    and role = any (
      array[
        'main_admin'::public.app_role,
        'owner'::public.app_role
      ]
    );

  if not found then
    raise exception 'Insufficient permissions to restore users'
      using errcode = '42501';
  end if;

  select *
  into v_target
  from public.user_profile
  where id = p_user_id
  for update;

  if not found then
    raise exception 'User not found'
      using errcode = 'P0002';
  end if;

  if v_target.archived_at is null then
    raise exception 'User is not archived'
      using errcode = '22023';
  end if;

  if v_target.id = v_actor.id then
    raise exception 'You cannot restore your own archived account'
      using errcode = '42501';
  end if;

  if v_actor.role = 'main_admin'::public.app_role
    and v_target.role <> all (
      array[
        'user'::public.app_role,
        'secondary_admin'::public.app_role
      ]
    )
  then
    raise exception 'Main admins can only restore User or Secondary Admin accounts'
      using errcode = '42501';
  end if;

  v_before := to_jsonb(v_target);
  v_restored_active := coalesce(v_target.active_before_archive, false);

  update public.user_profile
  set active = v_restored_active,
      archived_at = null,
      archived_by = null,
      active_before_archive = null
  where id = v_target.id
  returning * into v_target;

  update auth.users
  set banned_until = case
        when v_restored_active then null
        else statement_timestamp() + interval '100 years'
      end,
      updated_at = statement_timestamp()
  where id = v_target.id;

  insert into public.user_management_audit (
    actor_id,
    target_user_id,
    operation,
    outcome,
    before_state,
    after_state
  )
  values (
    v_actor.id,
    v_target.id,
    'restore',
    'succeeded',
    v_before,
    to_jsonb(v_target)
  );

  return v_target.id;
end;
$$;

create or replace function public.purge_user(p_user_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_actor public.user_profile%rowtype;
  v_target public.user_profile%rowtype;
  v_deleted_id uuid;
begin
  select *
  into v_actor
  from public.user_profile
  where id = auth.uid()
    and active is true
    and archived_at is null
    and role = 'owner'::public.app_role;

  if not found then
    raise exception 'Insufficient permissions to permanently purge users'
      using errcode = '42501';
  end if;

  select *
  into v_target
  from public.user_profile
  where id = p_user_id
  for update;

  if not found then
    raise exception 'User not found'
      using errcode = 'P0002';
  end if;

  if v_target.id = v_actor.id then
    raise exception 'You cannot permanently purge your own account'
      using errcode = '42501';
  end if;

  if v_target.archived_at is null then
    raise exception 'User must be archived before permanent purge'
      using errcode = '22023';
  end if;

  delete from auth.users
  where id = v_target.id
  returning id into v_deleted_id;

  if v_deleted_id is null then
    raise exception 'Auth user not found'
      using errcode = 'P0002';
  end if;

  insert into public.user_management_audit (
    actor_id,
    target_user_id,
    operation,
    outcome,
    before_state,
    after_state
  )
  values (
    v_actor.id,
    v_target.id,
    'purge',
    'succeeded',
    to_jsonb(v_target),
    null
  );

  return v_deleted_id;
end;
$$;

revoke execute on function public.archive_user(uuid) from public, anon;
revoke execute on function public.restore_user(uuid) from public, anon;
revoke execute on function public.purge_user(uuid) from public, anon;

grant execute on function public.archive_user(uuid) to authenticated;
grant execute on function public.restore_user(uuid) to authenticated;
grant execute on function public.purge_user(uuid) to authenticated;

commit;
