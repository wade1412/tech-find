\set ON_ERROR_STOP on

begin;

insert into auth.users (id)
values
  ('70000000-0000-4000-8000-000000000001'),
  ('70000000-0000-4000-8000-000000000002'),
  ('70000000-0000-4000-8000-000000000003');

insert into public.user_profile (id, alias, email, full_name, role, active)
values
  ('70000000-0000-4000-8000-000000000001', 'Isolation owner', 'isolation-owner@test.local', 'Isolation Owner', 'owner', true),
  ('70000000-0000-4000-8000-000000000002', 'Isolation main', 'isolation-main@test.local', 'Isolation Main', 'main_admin', true),
  ('70000000-0000-4000-8000-000000000003', 'Isolation secondary', 'isolation-secondary@test.local', 'Isolation Secondary', 'secondary_admin', true);

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"70000000-0000-4000-8000-000000000002","role":"authenticated"}',
  true
);

do $$
begin
  if exists (
    select 1
    from public.user_profile
    where id = '70000000-0000-4000-8000-000000000001'
  ) then
    raise exception 'main admin unexpectedly read the owner profile';
  end if;

  if (
    select count(*)
    from public.user_profile
    where id = any (
      array[
        '70000000-0000-4000-8000-000000000001'::uuid,
        '70000000-0000-4000-8000-000000000002'::uuid,
        '70000000-0000-4000-8000-000000000003'::uuid
      ]
    )
  ) <> 2 then
    raise exception 'main admin profile visibility is incorrect';
  end if;

  begin
    perform public.archive_user(
      '70000000-0000-4000-8000-000000000001'
    );
    raise exception 'main admin unexpectedly archived the owner account';
  exception when insufficient_privilege then null;
  end;
end;
$$;

select set_config(
  'request.jwt.claims',
  '{"sub":"70000000-0000-4000-8000-000000000003","role":"authenticated"}',
  true
);

do $$
begin
  if exists (
    select 1
    from public.user_profile
    where id = '70000000-0000-4000-8000-000000000001'
  ) then
    raise exception 'secondary admin unexpectedly read the owner profile';
  end if;

  if (
    select count(*)
    from public.user_profile
    where id = any (
      array[
        '70000000-0000-4000-8000-000000000001'::uuid,
        '70000000-0000-4000-8000-000000000002'::uuid,
        '70000000-0000-4000-8000-000000000003'::uuid
      ]
    )
  ) <> 1 then
    raise exception 'secondary admin could read profiles other than itself';
  end if;
end;
$$;

select set_config(
  'request.jwt.claims',
  '{"sub":"70000000-0000-4000-8000-000000000001","role":"authenticated"}',
  true
);

do $$
begin
  if (
    select count(*)
    from public.user_profile
    where id = any (
      array[
        '70000000-0000-4000-8000-000000000001'::uuid,
        '70000000-0000-4000-8000-000000000002'::uuid,
        '70000000-0000-4000-8000-000000000003'::uuid
      ]
    )
  ) <> 3 then
    raise exception 'owner could not read all managed profiles';
  end if;
end;
$$;

set local role postgres;

do $$
begin
  begin
    update public.user_profile
    set archived_at = statement_timestamp(),
        active = true
    where id = '70000000-0000-4000-8000-000000000003';
    raise exception 'database accepted an active archived user';
  exception when check_violation then null;
  end;
end;
$$;

rollback;

select 'owner profile isolation integration tests passed' as result;
