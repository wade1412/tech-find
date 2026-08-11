begin;

-- Customer main admins own the complete lifecycle of tenant data. Purge stays
-- behind SECURITY DEFINER RPCs, requires an active main-admin-or-higher actor,
-- and only accepts records that have already been archived.
create or replace function public.purge_technician(p_technician_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_deleted_id uuid;
begin
  if not public.current_user_has_role('main_admin'::public.app_role) then
    raise exception 'Insufficient permissions to permanently purge technicians'
      using errcode = '42501';
  end if;

  delete from public.technician
  where id = p_technician_id
    and archived_at is not null
  returning id into v_deleted_id;

  if v_deleted_id is null then
    if exists (select 1 from public.technician where id = p_technician_id) then
      raise exception 'Technician must be archived before permanent purge'
        using errcode = '22023';
    end if;

    raise exception 'Technician not found'
      using errcode = 'P0002';
  end if;

  return v_deleted_id;
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
  if not public.current_user_has_role('main_admin'::public.app_role) then
    raise exception 'Insufficient permissions to permanently purge users'
      using errcode = '42501';
  end if;

  select *
  into strict v_actor
  from public.user_profile
  where id = auth.uid();

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

  if public.app_role_rank(v_target.role) >= public.app_role_rank(v_actor.role) then
    raise exception 'You cannot permanently purge an equal or higher-role account'
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

create or replace function public.purge_unit(p_unit_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_deleted_id uuid;
begin
  if not public.current_user_has_role('main_admin'::public.app_role) then
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

create or replace function public.purge_brand(p_brand_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_deleted_id uuid;
begin
  if not public.current_user_has_role('main_admin'::public.app_role) then
    raise exception 'Insufficient permissions to permanently purge brands'
      using errcode = '42501';
  end if;

  delete from public.brand
  where id = p_brand_id
    and archived_at is not null
  returning id into v_deleted_id;

  if v_deleted_id is null then
    if exists (select 1 from public.brand where id = p_brand_id) then
      raise exception 'Brand must be archived before permanent purge'
        using errcode = '22023';
    end if;

    raise exception 'Brand not found'
      using errcode = 'P0002';
  end if;

  return v_deleted_id;
end;
$$;

create or replace function public.purge_brand_group(p_brand_group_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_group public.brand_group%rowtype;
begin
  if not public.current_user_has_role('main_admin'::public.app_role) then
    raise exception 'Insufficient permissions to permanently purge brand groups'
      using errcode = '42501';
  end if;

  select *
  into v_group
  from public.brand_group
  where id = p_brand_group_id
  for update;

  if not found then
    raise exception 'Brand group not found'
      using errcode = 'P0002';
  end if;

  if v_group.archived_at is null then
    raise exception 'Brand group must be archived before permanent purge'
      using errcode = '22023';
  end if;

  if exists (
    select 1
    from public.brand
    where group_id = p_brand_group_id
      and archived_at is null
  ) then
    raise exception 'Brand group contains an available brand'
      using errcode = '23514';
  end if;

  delete from public.brand
  where group_id = p_brand_group_id;

  delete from public.brand_group
  where id = p_brand_group_id;

  return p_brand_group_id;
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
  if not public.current_user_has_role('main_admin'::public.app_role) then
    raise exception 'Insufficient permissions to permanently purge specific issues'
      using errcode = '42501';
  end if;

  delete from public.specific_issue
  where id = p_specific_issue_id
    and archived_at is not null
  returning id into v_deleted_id;

  if v_deleted_id is null then
    if exists (
      select 1 from public.specific_issue where id = p_specific_issue_id
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

create or replace function public.purge_service_zone(p_service_zone_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_deleted_id uuid;
begin
  if not public.current_user_has_role('main_admin'::public.app_role) then
    raise exception 'Insufficient permissions to permanently purge service zones'
      using errcode = '42501';
  end if;

  delete from public.service_zone
  where id = p_service_zone_id
    and archived_at is not null
  returning id into v_deleted_id;

  if v_deleted_id is null then
    if exists (
      select 1 from public.service_zone where id = p_service_zone_id
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

revoke execute on function public.purge_technician(uuid) from public, anon;
revoke execute on function public.purge_user(uuid) from public, anon;
revoke execute on function public.purge_unit(uuid) from public, anon;
revoke execute on function public.purge_brand(uuid) from public, anon;
revoke execute on function public.purge_brand_group(uuid) from public, anon;
revoke execute on function public.purge_specific_issue(uuid) from public, anon;
revoke execute on function public.purge_service_zone(uuid) from public, anon;

grant execute on function public.purge_technician(uuid) to authenticated;
grant execute on function public.purge_user(uuid) to authenticated;
grant execute on function public.purge_unit(uuid) to authenticated;
grant execute on function public.purge_brand(uuid) to authenticated;
grant execute on function public.purge_brand_group(uuid) to authenticated;
grant execute on function public.purge_specific_issue(uuid) to authenticated;
grant execute on function public.purge_service_zone(uuid) to authenticated;

commit;
