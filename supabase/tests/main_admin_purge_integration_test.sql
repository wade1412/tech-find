\set ON_ERROR_STOP on

begin;

insert into auth.users (id)
values
  ('80000000-0000-4000-8000-000000000001'),
  ('80000000-0000-4000-8000-000000000002'),
  ('80000000-0000-4000-8000-000000000003'),
  ('80000000-0000-4000-8000-000000000004');

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
    '80000000-0000-4000-8000-000000000001',
    'Purge main',
    'purge-main@test.local',
    'Purge Main',
    'main_admin',
    true,
    null,
    null,
    null
  ),
  (
    '80000000-0000-4000-8000-000000000002',
    'Purge user',
    'purge-user@test.local',
    'Purge User',
    'user',
    true,
    null,
    null,
    null
  ),
  (
    '80000000-0000-4000-8000-000000000003',
    'Purge peer',
    'purge-peer@test.local',
    'Purge Peer',
    'main_admin',
    false,
    true,
    statement_timestamp(),
    '80000000-0000-4000-8000-000000000001'
  ),
  (
    '80000000-0000-4000-8000-000000000004',
    'Purge secondary',
    'purge-secondary@test.local',
    'Purge Secondary',
    'secondary_admin',
    true,
    null,
    null,
    null
  );

insert into public.technician (
  id,
  name,
  alias,
  can_service_built_in,
  gas,
  commercial,
  can_service_stacked_washer,
  can_service_stacked_dryer
)
values
  (
    '81000000-0000-4000-8000-000000000001',
    'Main Admin Purge Technician',
    'Purge Tech',
    false,
    false,
    false,
    false,
    false
  ),
  (
    '81000000-0000-4000-8000-000000000002',
    'Secondary Purge Technician',
    'Secondary Purge Tech',
    false,
    false,
    false,
    false,
    false
  );

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"80000000-0000-4000-8000-000000000001","role":"authenticated"}',
  true
);

select public.archive_technician(
  '81000000-0000-4000-8000-000000000001'
);
select public.purge_technician(
  '81000000-0000-4000-8000-000000000001'
);

select public.archive_user(
  '80000000-0000-4000-8000-000000000002'
);
select public.purge_user(
  '80000000-0000-4000-8000-000000000002'
);

set local role postgres;

do $$
begin
  if exists (
    select 1
    from public.technician
    where id = '81000000-0000-4000-8000-000000000001'
  ) then
    raise exception 'main admin purge did not delete the technician';
  end if;

  if exists (
    select 1
    from auth.users
    where id = '80000000-0000-4000-8000-000000000002'
  ) then
    raise exception 'main admin purge did not delete the Auth user';
  end if;

end;
$$;

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"80000000-0000-4000-8000-000000000001","role":"authenticated"}',
  true
);

do $$
begin
  begin
    perform public.purge_user(
      '80000000-0000-4000-8000-000000000003'
    );
    raise exception 'main admin unexpectedly purged a peer main admin';
  exception when insufficient_privilege then null;
  end;
end;
$$;

set local role postgres;
update public.technician
set active = false,
    active_before_archive = true,
    archived_at = statement_timestamp(),
    archived_by = '80000000-0000-4000-8000-000000000001'
where id = '81000000-0000-4000-8000-000000000002';

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"80000000-0000-4000-8000-000000000004","role":"authenticated"}',
  true
);

do $$
begin
  begin
    perform public.purge_technician(
      '81000000-0000-4000-8000-000000000002'
    );
    raise exception 'secondary admin unexpectedly purged a technician';
  exception when insufficient_privilege then null;
  end;
end;
$$;

rollback;

select 'main admin purge integration tests passed' as result;
