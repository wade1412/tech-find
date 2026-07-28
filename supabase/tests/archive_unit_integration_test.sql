\set ON_ERROR_STOP on

begin;

insert into auth.users (id)
values
  ('30000000-0000-0000-0000-000000000001'),
  ('30000000-0000-0000-0000-000000000002'),
  ('30000000-0000-0000-0000-000000000003');

insert into public.user_profile (
  id,
  alias,
  email,
  full_name,
  role,
  active
)
values
  (
    '30000000-0000-0000-0000-000000000001',
    'Unit Secondary',
    'unit-secondary@test.local',
    'Unit Secondary',
    'secondary_admin',
    true
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    'Unit Main',
    'unit-main@test.local',
    'Unit Main',
    'main_admin',
    true
  ),
  (
    '30000000-0000-0000-0000-000000000003',
    'Unit Owner',
    'unit-owner@test.local',
    'Unit Owner',
    'owner',
    true
  );

insert into public.unit (
  id,
  name,
  slug,
  active,
  display_order
)
values
  (
    '31000000-0000-0000-0000-000000000001',
    'Active Archive Test Unit',
    'active-archive-test-unit',
    true,
    10
  ),
  (
    '31000000-0000-0000-0000-000000000002',
    'Inactive Archive Test Unit',
    'inactive-archive-test-unit',
    false,
    20
  );

insert into public.technician (
  id,
  active,
  name,
  alias,
  notes,
  can_service_built_in,
  gas,
  commercial,
  can_service_stacked_washer,
  can_service_stacked_dryer,
  jobs_per_day,
  home_zip_code
)
values (
  '32000000-0000-0000-0000-000000000001',
  true,
  'Unit Cascade Technician',
  'Unit Cascade Tech',
  null,
  false,
  false,
  false,
  false,
  false,
  '1-2',
  '28201'
);

insert into public.specific_issue (id, name, slug, unit_id, active)
values (
  '33000000-0000-0000-0000-000000000001',
  'Unit Cascade Issue',
  'unit-cascade-issue',
  '31000000-0000-0000-0000-000000000001',
  true
);

insert into public.technician_skill_set (
  id,
  technician_id,
  unit_id,
  brand_group_id,
  specific_issue_id,
  commercial
)
values (
  '34000000-0000-0000-0000-000000000001',
  '32000000-0000-0000-0000-000000000001',
  '31000000-0000-0000-0000-000000000001',
  null,
  null,
  true
);

insert into public.technician_ignore_list (
  id,
  technician_id,
  unit_id
)
values (
  '35000000-0000-0000-0000-000000000001',
  '32000000-0000-0000-0000-000000000001',
  '31000000-0000-0000-0000-000000000001'
);

set local role authenticated;

select set_config(
  'request.jwt.claims',
  '{"sub":"30000000-0000-0000-0000-000000000001","role":"authenticated"}',
  true
);

do $$
begin
  begin
    perform public.archive_unit(
      '31000000-0000-0000-0000-000000000001'
    );
    raise exception 'secondary_admin unexpectedly archived a unit';
  exception
    when insufficient_privilege then null;
  end;
end;
$$;

select set_config(
  'request.jwt.claims',
  '{"sub":"30000000-0000-0000-0000-000000000002","role":"authenticated"}',
  true
);

select public.archive_unit(
  '31000000-0000-0000-0000-000000000001'
);

do $$
declare
  v_unit public.unit%rowtype;
begin
  select * into v_unit
  from public.unit
  where id = '31000000-0000-0000-0000-000000000001';

  if v_unit.active is not false
    or v_unit.active_before_archive is not true
    or v_unit.archived_at is null
    or v_unit.archived_by <>
      '30000000-0000-0000-0000-000000000002'::uuid
  then
    raise exception 'unit archive state was not persisted correctly';
  end if;
end;
$$;

do $$
begin
  begin
    update public.unit
    set archived_at = null
    where id = '31000000-0000-0000-0000-000000000001';
    raise exception 'unit archive metadata was directly editable';
  exception
    when insufficient_privilege then null;
  end;
end;
$$;

select set_config(
  'request.jwt.claims',
  '{"sub":"30000000-0000-0000-0000-000000000001","role":"authenticated"}',
  true
);

do $$
begin
  if exists (
    select 1
    from public.unit
    where id = '31000000-0000-0000-0000-000000000001'
  ) then
    raise exception 'archived unit is visible to secondary_admin';
  end if;

  begin
    perform public.restore_unit(
      '31000000-0000-0000-0000-000000000001'
    );
    raise exception 'secondary_admin unexpectedly restored a unit';
  exception
    when insufficient_privilege then null;
  end;
end;
$$;

select set_config(
  'request.jwt.claims',
  '{"sub":"30000000-0000-0000-0000-000000000002","role":"authenticated"}',
  true
);

select public.restore_unit(
  '31000000-0000-0000-0000-000000000001'
);

do $$
declare
  v_unit public.unit%rowtype;
begin
  select * into v_unit
  from public.unit
  where id = '31000000-0000-0000-0000-000000000001';

  if v_unit.active is not true
    or v_unit.archived_at is not null
    or v_unit.archived_by is not null
    or v_unit.active_before_archive is not null
  then
    raise exception 'active unit state was not restored correctly';
  end if;
end;
$$;

select public.archive_unit(
  '31000000-0000-0000-0000-000000000002'
);
select public.restore_unit(
  '31000000-0000-0000-0000-000000000002'
);

do $$
begin
  if (
    select active
    from public.unit
    where id = '31000000-0000-0000-0000-000000000002'
  ) is not false then
    raise exception 'inactive unit state was not preserved across archive/restore';
  end if;
end;
$$;

select set_config(
  'request.jwt.claims',
  '{"sub":"30000000-0000-0000-0000-000000000003","role":"authenticated"}',
  true
);

do $$
begin
  begin
    perform public.purge_unit(
      '31000000-0000-0000-0000-000000000001'
    );
    raise exception 'owner unexpectedly purged a non-archived unit';
  exception
    when invalid_parameter_value then null;
  end;
end;
$$;

select set_config(
  'request.jwt.claims',
  '{"sub":"30000000-0000-0000-0000-000000000002","role":"authenticated"}',
  true
);

select public.archive_unit(
  '31000000-0000-0000-0000-000000000001'
);

do $$
begin
  begin
    perform public.purge_unit(
      '31000000-0000-0000-0000-000000000001'
    );
    raise exception 'main_admin unexpectedly purged a unit';
  exception
    when insufficient_privilege then null;
  end;
end;
$$;

select set_config(
  'request.jwt.claims',
  '{"sub":"30000000-0000-0000-0000-000000000003","role":"authenticated"}',
  true
);

select public.purge_unit(
  '31000000-0000-0000-0000-000000000001'
);

do $$
begin
  if exists (
    select 1
    from public.unit
    where id = '31000000-0000-0000-0000-000000000001'
  ) then
    raise exception 'owner purge did not delete unit';
  end if;

  if exists (
    select 1
    from public.specific_issue
    where id = '33000000-0000-0000-0000-000000000001'
  ) then
    raise exception 'unit purge did not cascade to specific issues';
  end if;

  if exists (
    select 1
    from public.technician_skill_set
    where id = '34000000-0000-0000-0000-000000000001'
  ) then
    raise exception 'unit purge did not cascade to technician skills';
  end if;

  if exists (
    select 1
    from public.technician_ignore_list
    where id = '35000000-0000-0000-0000-000000000001'
  ) then
    raise exception 'unit purge did not cascade to ignore-list references';
  end if;
end;
$$;

rollback;

select 'archive unit integration tests passed' as result;
