\set ON_ERROR_STOP on

begin;

insert into auth.users (id)
values
  ('12300000-0000-4000-8000-000000000001'),
  ('12300000-0000-4000-8000-000000000002'),
  ('12300000-0000-4000-8000-000000000003'),
  ('12300000-0000-4000-8000-000000000004'),
  ('12300000-0000-4000-8000-000000000005');

insert into public.user_profile (
  id,
  alias,
  email,
  full_name,
  role,
  active,
  active_before_archive,
  archived_at,
  archived_by
)
values
  (
    '12300000-0000-4000-8000-000000000001',
    'Active owner',
    'active-owner@test.local',
    'Active Owner',
    'owner',
    true,
    null,
    null,
    null
  ),
  (
    '12300000-0000-4000-8000-000000000002',
    'Inactive owner',
    'inactive-owner@test.local',
    'Inactive Owner',
    'owner',
    false,
    null,
    null,
    null
  ),
  (
    '12300000-0000-4000-8000-000000000003',
    'Archived owner',
    'archived-owner@test.local',
    'Archived Owner',
    'owner',
    false,
    true,
    statement_timestamp(),
    '12300000-0000-4000-8000-000000000001'
  ),
  (
    '12300000-0000-4000-8000-000000000004',
    'Active main admin',
    'active-main-admin@test.local',
    'Active Main Admin',
    'main_admin',
    true,
    null,
    null,
    null
  ),
  (
    '12300000-0000-4000-8000-000000000005',
    'Active user',
    'active-user@test.local',
    'Active User',
    'user',
    true,
    null,
    null,
    null
  );

insert into public.user_management_audit (
  id,
  actor_id,
  operation,
  outcome,
  requires_reconciliation,
  reconciled_at,
  reconciled_by,
  reconciliation_note
)
values
  (
    '81000000-0000-4000-8000-000000000001',
    '12300000-0000-4000-8000-000000000001',
    'update',
    'failed',
    true,
    null,
    null,
    null
  ),
  (
    '81000000-0000-4000-8000-000000000002',
    '12300000-0000-4000-8000-000000000001',
    'update',
    'failed',
    false,
    null,
    null,
    null
  ),
  (
    '81000000-0000-4000-8000-000000000003',
    '12300000-0000-4000-8000-000000000001',
    'update',
    'failed',
    true,
    statement_timestamp(),
    '12300000-0000-4000-8000-000000000001',
    'Already resolved'
  );

set local role authenticated;

select set_config(
  'request.jwt.claims',
  '{"sub":"12300000-0000-4000-8000-000000000004","role":"authenticated"}',
  true
);

do $$
begin
  begin
    perform public.resolve_user_management_reconciliation(
      '81000000-0000-4000-8000-000000000001',
      'Main admin attempt'
    );
    raise exception 'main admin unexpectedly resolved a reconciliation incident';
  exception when insufficient_privilege then null;
  end;
end;
$$;

select set_config(
  'request.jwt.claims',
  '{"sub":"12300000-0000-4000-8000-000000000005","role":"authenticated"}',
  true
);

do $$
begin
  begin
    perform public.resolve_user_management_reconciliation(
      '81000000-0000-4000-8000-000000000001',
      'User attempt'
    );
    raise exception 'regular user unexpectedly resolved a reconciliation incident';
  exception when insufficient_privilege then null;
  end;
end;
$$;

select set_config(
  'request.jwt.claims',
  '{"sub":"12300000-0000-4000-8000-000000000002","role":"authenticated"}',
  true
);

do $$
begin
  begin
    perform public.resolve_user_management_reconciliation(
      '81000000-0000-4000-8000-000000000001',
      'Inactive owner attempt'
    );
    raise exception 'inactive owner unexpectedly resolved a reconciliation incident';
  exception when insufficient_privilege then null;
  end;
end;
$$;

select set_config(
  'request.jwt.claims',
  '{"sub":"12300000-0000-4000-8000-000000000003","role":"authenticated"}',
  true
);

do $$
begin
  begin
    perform public.resolve_user_management_reconciliation(
      '81000000-0000-4000-8000-000000000001',
      'Archived owner attempt'
    );
    raise exception 'archived owner unexpectedly resolved a reconciliation incident';
  exception when insufficient_privilege then null;
  end;
end;
$$;

select set_config(
  'request.jwt.claims',
  '{"sub":"12300000-0000-4000-8000-000000000001","role":"authenticated"}',
  true
);

do $$
begin
  begin
    perform public.resolve_user_management_reconciliation(
      '81000000-0000-4000-8000-000000009999',
      'Unknown incident'
    );
    raise exception 'unknown audit id unexpectedly succeeded';
  exception when no_data_found then null;
  end;

  begin
    perform public.resolve_user_management_reconciliation(
      '81000000-0000-4000-8000-000000000001',
      null
    );
    raise exception 'null reconciliation note unexpectedly succeeded';
  exception when invalid_parameter_value then null;
  end;

  begin
    perform public.resolve_user_management_reconciliation(
      '81000000-0000-4000-8000-000000000001',
      '     '
    );
    raise exception 'blank reconciliation note unexpectedly succeeded';
  exception when invalid_parameter_value then null;
  end;

  begin
    perform public.resolve_user_management_reconciliation(
      '81000000-0000-4000-8000-000000000002',
      'Not applicable'
    );
    raise exception 'non-reconciliation audit record unexpectedly succeeded';
  exception when invalid_parameter_value then null;
  end;

  begin
    perform public.resolve_user_management_reconciliation(
      '81000000-0000-4000-8000-000000000003',
      'Resolve twice'
    );
    raise exception 'already resolved incident unexpectedly succeeded';
  exception when object_not_in_prerequisite_state then null;
  end;
end;
$$;

select public.resolve_user_management_reconciliation(
  '81000000-0000-4000-8000-000000000001',
  '   Auth and profile state manually reconciled   '
);

set local role postgres;

do $$
begin
  if not exists (
    select 1
    from public.user_management_audit
    where id = '81000000-0000-4000-8000-000000000001'
      and requires_reconciliation is true
      and reconciled_by = '12300000-0000-4000-8000-000000000001'
      and reconciliation_note = 'Auth and profile state manually reconciled'
      and reconciled_at is not null
  ) then
    raise exception 'reconciliation resolution state was not persisted correctly';
  end if;
end;
$$;

set local role authenticated;

select set_config(
  'request.jwt.claims',
  '{"sub":"12300000-0000-4000-8000-000000000001","role":"authenticated"}',
  true
);

do $$
begin
  begin
    perform public.resolve_user_management_reconciliation(
      '81000000-0000-4000-8000-000000000001',
      'Second resolution'
    );
    raise exception 'resolved incident unexpectedly accepted a second resolution';
  exception when object_not_in_prerequisite_state then null;
  end;
end;
$$;

rollback;

select 'user management reconciliation tests passed' as result;
