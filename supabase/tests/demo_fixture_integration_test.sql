\set ON_ERROR_STOP on

begin;

do $$
declare
  v_count integer;
begin
  select count(*)
  into v_count
  from public.service_zone
  where id between
    '10000000-0000-4000-8000-000000000001'::uuid and
    '10000000-0000-4000-8000-000000000003'::uuid;

  if v_count <> 3 then
    raise exception 'Expected 3 deterministic demo service zones, found %', v_count;
  end if;

  select count(*)
  into v_count
  from public.unit
  where id between
    '11000000-0000-4000-8000-000000000001'::uuid and
    '11000000-0000-4000-8000-000000000006'::uuid
    and display_order % 10 = 0;

  if v_count <> 6 then
    raise exception 'Demo units are missing or do not use gap-friendly display order';
  end if;

  if not exists (
    select 1
    from public.unit
    where id = '11000000-0000-4000-8000-000000000006'
      and active is false
      and archived_at is null
  ) then
    raise exception 'Inactive Legacy Dishwasher fixture is invalid';
  end if;

  select count(*)
  into v_count
  from public.technician
  where id between
    '15000000-0000-4000-8000-000000000001'::uuid and
    '15000000-0000-4000-8000-000000000007'::uuid;

  if v_count <> 7 then
    raise exception 'Expected 7 deterministic demo technicians, found %', v_count;
  end if;

  if not exists (
    select 1
    from public.technician
    where id = '15000000-0000-4000-8000-000000000007'
      and active is false
      and archived_at is not null
      and archived_by is null
      and active_before_archive is true
  ) then
    raise exception 'Archived Demo technician lifecycle state is invalid';
  end if;

  -- Alex must cover North and have both Standard Washer and Dryer skills.
  select count(*)
  into v_count
  from public.technician_skill_set
  where technician_id = '15000000-0000-4000-8000-000000000001'
    and unit_id in (
      '11000000-0000-4000-8000-000000000001',
      '11000000-0000-4000-8000-000000000002'
    )
    and brand_group_id = '12000000-0000-4000-8000-000000000001'
    and commercial is false;

  if v_count <> 2 or not exists (
    select 1
    from public.technician_service_zone
    where technician_id = '15000000-0000-4000-8000-000000000001'
      and zone_id = '10000000-0000-4000-8000-000000000001'
  ) then
    raise exception 'Alex stacked Washer/Dryer fixture is invalid';
  end if;

  -- Morgan's otherwise valid Standard Washer skill must be overridden by LG.
  if not exists (
    select 1
    from public.technician_ignore_list
    where technician_id = '15000000-0000-4000-8000-000000000002'
      and brand_id = '13000000-0000-4000-8000-000000000004'
      and unit_id is null
      and specific_issue_id is null
  ) then
    raise exception 'Morgan LG ignore fixture is invalid';
  end if;

  -- Issue skills must remain attached to the same unit as their issue.
  if exists (
    select 1
    from public.technician_skill_set skill
    join public.specific_issue issue on issue.id = skill.specific_issue_id
    where skill.technician_id between
      '15000000-0000-4000-8000-000000000001'::uuid and
      '15000000-0000-4000-8000-000000000007'::uuid
      and skill.unit_id <> issue.unit_id
  ) then
    raise exception 'A demo issue skill is assigned to the wrong unit';
  end if;

  -- Jordan needs both independent rows for commercial and issue matching.
  select count(*)
  into v_count
  from public.technician_skill_set
  where technician_id = '15000000-0000-4000-8000-000000000005'
    and unit_id = '11000000-0000-4000-8000-000000000002'
    and (
      (commercial is true and brand_group_id is null and specific_issue_id is null)
      or
      (
        commercial is false
        and brand_group_id is null
        and specific_issue_id = '14000000-0000-4000-8000-000000000002'
      )
    );

  if v_count <> 2 then
    raise exception 'Jordan commercial Dryer issue fixture is invalid';
  end if;
end;
$$;

rollback;
