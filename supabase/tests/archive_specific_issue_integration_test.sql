\set ON_ERROR_STOP on

begin;

insert into auth.users (id)
values
  ('50000000-0000-4000-8000-000000000001'),
  ('50000000-0000-4000-8000-000000000002'),
  ('50000000-0000-4000-8000-000000000003');

insert into public.user_profile (id, alias, email, full_name, role, active)
values
  ('50000000-0000-4000-8000-000000000001', 'Issue secondary', 'issue-secondary@test.local', 'Issue Secondary', 'secondary_admin', true),
  ('50000000-0000-4000-8000-000000000002', 'Issue main', 'issue-main@test.local', 'Issue Main', 'main_admin', true),
  ('50000000-0000-4000-8000-000000000003', 'Issue owner', 'issue-owner@test.local', 'Issue Owner', 'owner', true);

insert into public.unit (id, name, slug, display_order, active)
values (
  '51000000-0000-4000-8000-000000000001',
  'Issue Test Unit',
  'issue-test-unit',
  10,
  true
);

insert into public.specific_issue (id, name, slug, unit_id, active)
values
  ('52000000-0000-4000-8000-000000000001', 'Lifecycle Issue', 'lifecycle-issue', '51000000-0000-4000-8000-000000000001', true),
  ('52000000-0000-4000-8000-000000000002', 'Purge Issue', 'purge-issue', '51000000-0000-4000-8000-000000000001', true);

insert into public.technician (
  id, name, alias, can_service_built_in, gas, commercial,
  can_service_stacked_washer, can_service_stacked_dryer
)
values (
  '53000000-0000-4000-8000-000000000001',
  'Issue Test Technician',
  'Issue Tech',
  false, false, false, false, false
);

insert into public.technician_ignore_list (
  id, technician_id, specific_issue_id
)
values (
  '54000000-0000-4000-8000-000000000001',
  '53000000-0000-4000-8000-000000000001',
  '52000000-0000-4000-8000-000000000002'
);

insert into public.technician_skill_set (
  id, technician_id, unit_id, brand_group_id, specific_issue_id, commercial
)
values (
  '55000000-0000-4000-8000-000000000001',
  '53000000-0000-4000-8000-000000000001',
  '51000000-0000-4000-8000-000000000001',
  null,
  '52000000-0000-4000-8000-000000000002',
  false
);

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"50000000-0000-4000-8000-000000000001","role":"authenticated"}',
  true
);

do $$
begin
  begin
    insert into public.specific_issue (name, slug, unit_id, active)
    values (
      'Forbidden Issue',
      'forbidden-issue',
      '51000000-0000-4000-8000-000000000001',
      true
    );
    raise exception 'secondary admin unexpectedly created an issue';
  exception when insufficient_privilege then null;
  end;

  begin
    perform public.archive_specific_issue(
      '52000000-0000-4000-8000-000000000001'
    );
    raise exception 'secondary admin unexpectedly archived an issue';
  exception when insufficient_privilege then null;
  end;
end;
$$;

select set_config(
  'request.jwt.claims',
  '{"sub":"50000000-0000-4000-8000-000000000002","role":"authenticated"}',
  true
);

insert into public.specific_issue (name, slug, unit_id, active)
values (
  'Created Issue',
  'created-issue',
  '51000000-0000-4000-8000-000000000001',
  true
);

update public.specific_issue
set name = 'Updated Issue'
where slug = 'created-issue';

do $$
begin
  if not exists (
    select 1 from public.specific_issue
    where slug = 'created-issue'
      and name = 'Updated Issue'
  ) then
    raise exception 'main admin create/update policies failed';
  end if;

  begin
    update public.specific_issue
    set archived_at = statement_timestamp()
    where slug = 'created-issue';
    raise exception 'archive metadata was directly writable';
  exception when insufficient_privilege then null;
  end;
end;
$$;

select public.archive_specific_issue(
  '52000000-0000-4000-8000-000000000001'
);

do $$
begin
  if not exists (
    select 1 from public.specific_issue
    where id = '52000000-0000-4000-8000-000000000001'
      and active is false
      and active_before_archive is true
      and archived_at is not null
  ) then
    raise exception 'issue archive state was not preserved';
  end if;
end;
$$;

select set_config(
  'request.jwt.claims',
  '{"sub":"50000000-0000-4000-8000-000000000001","role":"authenticated"}',
  true
);

do $$
begin
  if exists (
    select 1 from public.specific_issue
    where id = '52000000-0000-4000-8000-000000000001'
  ) then
    raise exception 'secondary admin unexpectedly read an archived issue';
  end if;

  if not exists (
    select 1 from public.specific_issue
    where id = '52000000-0000-4000-8000-000000000002'
  ) then
    raise exception 'secondary admin could not read an available issue';
  end if;
end;
$$;

select set_config(
  'request.jwt.claims',
  '{"sub":"50000000-0000-4000-8000-000000000002","role":"authenticated"}',
  true
);

select public.archive_unit('51000000-0000-4000-8000-000000000001');

do $$
begin
  begin
    insert into public.specific_issue (name, slug, unit_id, active)
    values (
      'Archived Unit Issue',
      'archived-unit-issue',
      '51000000-0000-4000-8000-000000000001',
      true
    );
    raise exception 'issue was created under an archived unit';
  exception when insufficient_privilege then null;
  end;

  begin
    perform public.restore_specific_issue(
      '52000000-0000-4000-8000-000000000001'
    );
    raise exception 'issue restored while its unit was archived';
  exception when invalid_parameter_value then null;
  end;
end;
$$;

select public.restore_unit('51000000-0000-4000-8000-000000000001');
select public.restore_specific_issue(
  '52000000-0000-4000-8000-000000000001'
);
select public.archive_specific_issue(
  '52000000-0000-4000-8000-000000000002'
);

do $$
begin
  begin
    perform public.purge_specific_issue(
      '52000000-0000-4000-8000-000000000002'
    );
    raise exception 'main admin unexpectedly purged an issue';
  exception when insufficient_privilege then null;
  end;
end;
$$;

select set_config(
  'request.jwt.claims',
  '{"sub":"50000000-0000-4000-8000-000000000003","role":"authenticated"}',
  true
);

select public.purge_specific_issue(
  '52000000-0000-4000-8000-000000000002'
);

set local role postgres;

do $$
begin
  if exists (
    select 1 from public.specific_issue
    where id = '52000000-0000-4000-8000-000000000002'
  ) or exists (
    select 1 from public.technician_ignore_list
    where id = '54000000-0000-4000-8000-000000000001'
  ) or exists (
    select 1 from public.technician_skill_set
    where id = '55000000-0000-4000-8000-000000000001'
  ) then
    raise exception 'issue purge did not cascade dependencies';
  end if;
end;
$$;

rollback;

select 'archive specific issue integration tests passed' as result;
