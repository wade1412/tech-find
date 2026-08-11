\set ON_ERROR_STOP on

begin;

insert into auth.users (id)
values
  ('40000000-0000-4000-8000-000000000001'),
  ('40000000-0000-4000-8000-000000000002'),
  ('40000000-0000-4000-8000-000000000003');

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
    '40000000-0000-4000-8000-000000000001',
    'Brand secondary',
    'brand-secondary@test.local',
    'Brand Secondary',
    'secondary_admin',
    true
  ),
  (
    '40000000-0000-4000-8000-000000000002',
    'Brand main',
    'brand-main@test.local',
    'Brand Main',
    'main_admin',
    true
  ),
  (
    '40000000-0000-4000-8000-000000000003',
    'Brand owner',
    'brand-owner@test.local',
    'Brand Owner',
    'owner',
    true
  );

insert into public.brand_group (
  id,
  name,
  slug,
  active,
  display_order
)
values
  (
    '41000000-0000-4000-8000-000000000001',
    'Lifecycle Group',
    'lifecycle-group',
    true,
    10
  ),
  (
    '41000000-0000-4000-8000-000000000002',
    'Standalone Group',
    'standalone-group',
    true,
    20
  ),
  (
    '41000000-0000-4000-8000-000000000003',
    'Purge Group',
    'purge-group',
    true,
    30
  );

insert into public.brand (
  id,
  name,
  slug,
  group_id,
  active
)
values
  (
    '42000000-0000-4000-8000-000000000001',
    'Active Child',
    'active-child',
    '41000000-0000-4000-8000-000000000001',
    true
  ),
  (
    '42000000-0000-4000-8000-000000000002',
    'Inactive Child',
    'inactive-child',
    '41000000-0000-4000-8000-000000000001',
    false
  ),
  (
    '42000000-0000-4000-8000-000000000003',
    'Individually Archived Child',
    'individual-child',
    '41000000-0000-4000-8000-000000000001',
    true
  ),
  (
    '42000000-0000-4000-8000-000000000004',
    'Standalone Brand',
    'standalone-brand',
    '41000000-0000-4000-8000-000000000002',
    true
  ),
  (
    '42000000-0000-4000-8000-000000000005',
    'Purge Child',
    'purge-child',
    '41000000-0000-4000-8000-000000000003',
    true
  );

insert into public.unit (
  id,
  name,
  slug,
  display_order
)
values (
  '43000000-0000-4000-8000-000000000001',
  'Brand Test Unit',
  'brand-test-unit',
  10
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
values (
  '44000000-0000-4000-8000-000000000001',
  'Brand Test Technician',
  'Brand Tech',
  false,
  false,
  false,
  false,
  false
);

insert into public.technician_ignore_list (
  id,
  technician_id,
  brand_id
)
values
  (
    '45000000-0000-4000-8000-000000000001',
    '44000000-0000-4000-8000-000000000001',
    '42000000-0000-4000-8000-000000000004'
  ),
  (
    '45000000-0000-4000-8000-000000000002',
    '44000000-0000-4000-8000-000000000001',
    '42000000-0000-4000-8000-000000000005'
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
  '46000000-0000-4000-8000-000000000001',
  '44000000-0000-4000-8000-000000000001',
  '43000000-0000-4000-8000-000000000001',
  '41000000-0000-4000-8000-000000000003',
  null,
  false
);

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"40000000-0000-4000-8000-000000000001","role":"authenticated"}',
  true
);

do $$
begin
  begin
    insert into public.brand_group (
      name,
      slug,
      active,
      display_order
    )
    values (
      'Forbidden Group',
      'forbidden-group',
      true,
      40
    );

    raise exception 'secondary admin unexpectedly created a brand group';
  exception
    when insufficient_privilege then null;
  end;

  begin
    perform public.archive_brand(
      '42000000-0000-4000-8000-000000000001'
    );

    raise exception 'secondary admin unexpectedly archived a brand';
  exception
    when insufficient_privilege then null;
  end;
end;
$$;

select set_config(
  'request.jwt.claims',
  '{"sub":"40000000-0000-4000-8000-000000000002","role":"authenticated"}',
  true
);

insert into public.brand_group (
  name,
  slug,
  active,
  display_order
)
values (
  'Created Through API',
  'created-through-api',
  true,
  40
);

insert into public.brand (
  name,
  slug,
  group_id,
  active
)
select
  'Created Brand',
  'created-brand',
  id,
  true
from public.brand_group
where slug = 'created-through-api';

update public.brand
set name = 'Updated Brand'
where slug = 'created-brand';

do $$
begin
  if not exists (
    select 1
    from public.brand b
    join public.brand_group bg on bg.id = b.group_id
    where b.slug = 'created-brand'
      and b.name = 'Updated Brand'
      and bg.slug = 'created-through-api'
  ) then
    raise exception 'main admin create/update policies failed';
  end if;

  begin
    update public.brand
    set archived_at = statement_timestamp()
    where slug = 'created-brand';

    raise exception 'archive metadata was directly writable';
  exception
    when insufficient_privilege then null;
  end;
end;
$$;

select public.archive_brand(
  '42000000-0000-4000-8000-000000000003'
);

select public.archive_brand_group(
  '41000000-0000-4000-8000-000000000001'
);

do $$
begin
  if (
    select count(*)
    from public.brand
    where group_id = '41000000-0000-4000-8000-000000000001'
      and archived_at is not null
  ) <> 3 then
    raise exception 'group archive did not archive every available child';
  end if;

  if (
    select count(*)
    from public.brand
    where group_id = '41000000-0000-4000-8000-000000000001'
      and archived_via_group_id =
        '41000000-0000-4000-8000-000000000001'
  ) <> 2 then
    raise exception 'group archive overwrote an individual archive';
  end if;

  begin
    perform public.restore_brand(
      '42000000-0000-4000-8000-000000000001'
    );

    raise exception 'group-owned brand was restored independently';
  exception
    when invalid_parameter_value then null;
  end;

  begin
    insert into public.brand (
      name,
      slug,
      group_id,
      active
    )
    values (
      'Archived Group Child',
      'archived-group-child',
      '41000000-0000-4000-8000-000000000001',
      true
    );

    raise exception 'brand was inserted into an archived group';
  exception
    when insufficient_privilege then null;
  end;
end;
$$;

set local role postgres;

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"40000000-0000-4000-8000-000000000001","role":"authenticated"}',
  true
);

do $$
begin
  if exists (
    select 1
    from public.brand_group
    where id = '41000000-0000-4000-8000-000000000001'
  ) or exists (
    select 1
    from public.brand
    where group_id = '41000000-0000-4000-8000-000000000001'
  ) then
    raise exception 'archived hierarchy is visible to secondary admin';
  end if;
end;
$$;

select set_config(
  'request.jwt.claims',
  '{"sub":"40000000-0000-4000-8000-000000000002","role":"authenticated"}',
  true
);

select public.restore_brand_group(
  '41000000-0000-4000-8000-000000000001'
);

set local role postgres;

do $$
declare
  v_active_child public.brand%rowtype;
  v_inactive_child public.brand%rowtype;
  v_individual_child public.brand%rowtype;
begin
  select * into v_active_child
  from public.brand
  where id = '42000000-0000-4000-8000-000000000001';

  select * into v_inactive_child
  from public.brand
  where id = '42000000-0000-4000-8000-000000000002';

  select * into v_individual_child
  from public.brand
  where id = '42000000-0000-4000-8000-000000000003';

  if v_active_child.active is not true
    or v_active_child.archived_at is not null
  then
    raise exception 'active child state was not restored';
  end if;

  if v_inactive_child.active is not false
    or v_inactive_child.archived_at is not null
  then
    raise exception 'inactive child state was not preserved';
  end if;

  if v_individual_child.archived_at is null
    or v_individual_child.archived_via_group_id is not null
  then
    raise exception 'individual child archive was incorrectly restored';
  end if;
end;
$$;

set local role authenticated;
select set_config(
  'request.jwt.claims',
  '{"sub":"40000000-0000-4000-8000-000000000002","role":"authenticated"}',
  true
);

select public.archive_brand(
  '42000000-0000-4000-8000-000000000004'
);

select public.archive_brand_group(
  '41000000-0000-4000-8000-000000000003'
);

select public.purge_brand(
  '42000000-0000-4000-8000-000000000004'
);

select public.purge_brand_group(
  '41000000-0000-4000-8000-000000000003'
);

set local role postgres;

do $$
begin
  if exists (
    select 1 from public.brand
    where id = '42000000-0000-4000-8000-000000000004'
  ) or exists (
    select 1 from public.technician_ignore_list
    where id = '45000000-0000-4000-8000-000000000001'
  ) then
    raise exception 'brand purge did not cascade ignore-list references';
  end if;

  if exists (
    select 1 from public.brand_group
    where id = '41000000-0000-4000-8000-000000000003'
  ) or exists (
    select 1 from public.brand
    where id = '42000000-0000-4000-8000-000000000005'
  ) or exists (
    select 1 from public.technician_ignore_list
    where id = '45000000-0000-4000-8000-000000000002'
  ) or exists (
    select 1 from public.technician_skill_set
    where id = '46000000-0000-4000-8000-000000000001'
  ) then
    raise exception 'brand group purge did not cascade dependencies';
  end if;
end;
$$;

rollback;

select 'archive brand integration tests passed' as result;
