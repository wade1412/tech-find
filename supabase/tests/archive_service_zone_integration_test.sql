\set ON_ERROR_STOP on

begin;

insert into auth.users (id)
values
  ('60000000-0000-4000-8000-000000000001'),
  ('60000000-0000-4000-8000-000000000002'),
  ('60000000-0000-4000-8000-000000000003');

insert into public.user_profile (id, alias, email, full_name, role, active)
values
  ('60000000-0000-4000-8000-000000000001', 'Zone secondary', 'zone-secondary@test.local', 'Zone Secondary', 'secondary_admin', true),
  ('60000000-0000-4000-8000-000000000002', 'Zone main', 'zone-main@test.local', 'Zone Main', 'main_admin', true),
  ('60000000-0000-4000-8000-000000000003', 'Zone owner', 'zone-owner@test.local', 'Zone Owner', 'owner', true);

insert into public.service_zone (
  id,
  name,
  slug,
  display_order,
  active
)
values
  ('61000000-0000-4000-8000-000000000001', 'Lifecycle Zone', 'lifecycle-zone', 10, true),
  ('61000000-0000-4000-8000-000000000002', 'Purge Zone', 'purge-zone', 20, false);

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
values (
  '62000000-0000-4000-8000-000000000001',
  'Zone Test Technician',
  'Zone Tech',
  false,
  false,
  false,
  false,
  false
);

insert into public.technician_service_zone (technician_id, zone_id)
values
  ('62000000-0000-4000-8000-000000000001', '61000000-0000-4000-8000-000000000001'),
  ('62000000-0000-4000-8000-000000000001', '61000000-0000-4000-8000-000000000002');

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"60000000-0000-4000-8000-000000000001","role":"authenticated"}',
  true
);

do $$
begin
  begin
    insert into public.service_zone (name, slug, display_order, active)
    values ('Forbidden Zone', 'forbidden-zone', 30, true);
    raise exception 'secondary admin unexpectedly created a service zone';
  exception when insufficient_privilege then null;
  end;

  begin
    perform public.archive_service_zone(
      '61000000-0000-4000-8000-000000000001'
    );
    raise exception 'secondary admin unexpectedly archived a service zone';
  exception when insufficient_privilege then null;
  end;
end;
$$;

select set_config(
  'request.jwt.claims',
  '{"sub":"60000000-0000-4000-8000-000000000002","role":"authenticated"}',
  true
);

insert into public.service_zone (name, slug, display_order, active)
values ('Created Zone', 'created-zone', 30, true);

update public.service_zone
set name = 'Updated Zone',
    display_order = 40
where slug = 'created-zone';

do $$
begin
  if not exists (
    select 1
    from public.service_zone
    where slug = 'created-zone'
      and name = 'Updated Zone'
      and display_order = 40
  ) then
    raise exception 'main admin create/update policies failed';
  end if;

  begin
    update public.service_zone
    set archived_at = statement_timestamp()
    where slug = 'created-zone';
    raise exception 'archive metadata was directly writable';
  exception when insufficient_privilege then null;
  end;
end;
$$;

select public.archive_service_zone(
  '61000000-0000-4000-8000-000000000001'
);

do $$
begin
  if not exists (
    select 1
    from public.service_zone
    where id = '61000000-0000-4000-8000-000000000001'
      and active is false
      and active_before_archive is true
      and archived_at is not null
      and archived_by = '60000000-0000-4000-8000-000000000002'
  ) then
    raise exception 'service zone archive state was not preserved';
  end if;

  if not exists (
    select 1
    from public.technician_service_zone
    where technician_id = '62000000-0000-4000-8000-000000000001'
      and zone_id = '61000000-0000-4000-8000-000000000001'
  ) then
    raise exception 'archive removed the technician assignment';
  end if;

  begin
    insert into public.technician_service_zone (technician_id, zone_id)
    values (
      '62000000-0000-4000-8000-000000000001',
      '61000000-0000-4000-8000-000000000001'
    );
    raise exception 'archived service zone was directly assigned';
  exception when insufficient_privilege then null;
  end;

  begin
    perform public.update_technician_service_zones(
      '62000000-0000-4000-8000-000000000001',
      array['61000000-0000-4000-8000-000000000001']::uuid[],
      '{}'::uuid[]
    );
    raise exception 'archived service zone was assigned through the RPC';
  exception when invalid_parameter_value then null;
  end;
end;
$$;

select set_config(
  'request.jwt.claims',
  '{"sub":"60000000-0000-4000-8000-000000000001","role":"authenticated"}',
  true
);

do $$
begin
  if exists (
    select 1
    from public.service_zone
    where id = '61000000-0000-4000-8000-000000000001'
  ) then
    raise exception 'secondary admin unexpectedly read an archived service zone';
  end if;

  if exists (
    select 1
    from public.technician_service_zone
    where zone_id = '61000000-0000-4000-8000-000000000001'
  ) then
    raise exception 'secondary admin unexpectedly read an archived zone assignment';
  end if;
end;
$$;

select set_config(
  'request.jwt.claims',
  '{"sub":"60000000-0000-4000-8000-000000000002","role":"authenticated"}',
  true
);

select public.restore_service_zone(
  '61000000-0000-4000-8000-000000000001'
);

select public.archive_service_zone(
  '61000000-0000-4000-8000-000000000002'
);

select public.restore_service_zone(
  '61000000-0000-4000-8000-000000000002'
);

do $$
begin
  if not exists (
    select 1
    from public.service_zone
    where id = '61000000-0000-4000-8000-000000000001'
      and active is true
      and archived_at is null
      and active_before_archive is null
  ) then
    raise exception 'active service zone restore failed';
  end if;

  if not exists (
    select 1
    from public.service_zone
    where id = '61000000-0000-4000-8000-000000000002'
      and active is false
      and archived_at is null
      and active_before_archive is null
  ) then
    raise exception 'inactive service zone restore state was not preserved';
  end if;
end;
$$;

select public.archive_service_zone(
  '61000000-0000-4000-8000-000000000002'
);

do $$
begin
  begin
    perform public.purge_service_zone(
      '61000000-0000-4000-8000-000000000002'
    );
    raise exception 'main admin unexpectedly purged a service zone';
  exception when insufficient_privilege then null;
  end;
end;
$$;

select set_config(
  'request.jwt.claims',
  '{"sub":"60000000-0000-4000-8000-000000000003","role":"authenticated"}',
  true
);

select public.purge_service_zone(
  '61000000-0000-4000-8000-000000000002'
);

set local role postgres;

do $$
begin
  if exists (
    select 1
    from public.service_zone
    where id = '61000000-0000-4000-8000-000000000002'
  ) or exists (
    select 1
    from public.technician_service_zone
    where zone_id = '61000000-0000-4000-8000-000000000002'
  ) then
    raise exception 'service zone purge did not cascade assignments';
  end if;
end;
$$;

rollback;

select 'archive service zone integration tests passed' as result;
