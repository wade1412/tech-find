-- Atomically create a technician and all required related records.
-- Existing update RPCs remain the single validation path for zones, skills,
-- and ignore-list items.
create or replace function public.create_technician(
  p_profile jsonb,
  p_zone_ids uuid[],
  p_skills jsonb,
  p_ignore_items jsonb default '[]'::jsonb
)
returns public.technician
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_profile public.technician%rowtype;
  v_name text;
  v_alias text;
  v_home_zip_code text;
  v_jobs_per_day text;
  v_notes text;
  v_ignore_items jsonb := coalesce(p_ignore_items, '[]'::jsonb);
  v_jobs_min integer;
  v_jobs_max integer;
begin
  if not exists (
    select 1
    from public.user_profile up
    where up.id = auth.uid()
      and up.active is true
      and up.role = any (
        array[
          'secondary_admin'::public.app_role,
          'main_admin'::public.app_role,
          'owner'::public.app_role
        ]
      )
  ) then
    raise exception 'Insufficient permissions to create technicians'
      using errcode = '42501';
  end if;

  if p_profile is null or jsonb_typeof(p_profile) <> 'object' then
    raise exception 'Invalid technician profile payload'
      using errcode = '22023';
  end if;

  if exists (
    select 1
    from unnest(array[
      'name',
      'alias',
      'home_zip_code',
      'jobs_per_day'
    ]) as required_string(key)
    where jsonb_typeof(p_profile -> required_string.key) is distinct from 'string'
  ) then
    raise exception 'Invalid technician profile payload: required text field is missing'
      using errcode = '22023';
  end if;

  if exists (
    select 1
    from unnest(array[
      'active',
      'gas',
      'commercial',
      'can_service_built_in',
      'can_service_stacked_washer',
      'can_service_stacked_dryer'
    ]) as required_boolean(key)
    where jsonb_typeof(p_profile -> required_boolean.key) is distinct from 'boolean'
  ) then
    raise exception 'Invalid technician profile payload: required capability is missing'
      using errcode = '22023';
  end if;

  if p_profile ? 'notes'
    and jsonb_typeof(p_profile -> 'notes') not in ('string', 'null')
  then
    raise exception 'Invalid technician profile payload: notes must be text or null'
      using errcode = '22023';
  end if;

  v_name := btrim(p_profile ->> 'name');
  v_alias := btrim(p_profile ->> 'alias');
  v_home_zip_code := btrim(p_profile ->> 'home_zip_code');
  v_jobs_per_day := btrim(p_profile ->> 'jobs_per_day');
  v_notes := nullif(btrim(coalesce(p_profile ->> 'notes', '')), '');

  if v_name = ''
    or char_length(v_name) > 24
    or v_name !~ '^[A-Za-z[:space:].''`-]+$'
  then
    raise exception 'Invalid technician profile payload: invalid name'
      using errcode = '22023';
  end if;

  if v_alias = ''
    or char_length(v_alias) > 24
    or v_alias !~ '^[A-Za-z[:space:]''`-]+$'
  then
    raise exception 'Invalid technician profile payload: invalid alias'
      using errcode = '22023';
  end if;

  if v_home_zip_code !~ '^[0-9]{5}$' then
    raise exception 'Invalid technician profile payload: ZIP code must contain exactly 5 digits'
      using errcode = '22023';
  end if;

  if v_jobs_per_day !~ '^[1-9](-[1-9])?$' then
    raise exception 'Invalid technician profile payload: invalid jobs range'
      using errcode = '22023';
  end if;

  v_jobs_min := split_part(v_jobs_per_day, '-', 1)::integer;
  v_jobs_max := case
    when position('-' in v_jobs_per_day) > 0
      then split_part(v_jobs_per_day, '-', 2)::integer
    else v_jobs_min
  end;

  if v_jobs_min > v_jobs_max then
    raise exception 'Invalid technician profile payload: invalid jobs range'
      using errcode = '22023';
  end if;

  if char_length(coalesce(v_notes, '')) > 300 then
    raise exception 'Invalid technician profile payload: notes are too long'
      using errcode = '22023';
  end if;

  if cardinality(coalesce(p_zone_ids, '{}'::uuid[])) < 1 then
    raise exception 'A technician must have at least one service zone'
      using errcode = '22023';
  end if;

  if p_skills is null
    or jsonb_typeof(p_skills) <> 'array'
    or jsonb_array_length(p_skills) < 1
  then
    raise exception 'A technician must have at least one skill'
      using errcode = '22023';
  end if;

  if jsonb_typeof(v_ignore_items) <> 'array' then
    raise exception 'p_ignore_items must be a JSON array'
      using errcode = '22023';
  end if;

  insert into public.technician (
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
    (p_profile ->> 'active')::boolean,
    v_name,
    v_alias,
    v_notes,
    (p_profile ->> 'can_service_built_in')::boolean,
    (p_profile ->> 'gas')::boolean,
    (p_profile ->> 'commercial')::boolean,
    (p_profile ->> 'can_service_stacked_washer')::boolean,
    (p_profile ->> 'can_service_stacked_dryer')::boolean,
    v_jobs_per_day,
    v_home_zip_code
  )
  returning * into v_profile;

  perform 1
  from public.update_technician_service_zones(
    v_profile.id,
    p_zone_ids,
    '{}'::uuid[]
  );

  perform 1
  from public.update_technician_skills(
    v_profile.id,
    p_skills,
    '{}'::uuid[]
  );

  if jsonb_array_length(v_ignore_items) > 0 then
    perform 1
    from public.update_technician_ignore_list(
      v_profile.id,
      v_ignore_items,
      '{}'::uuid[]
    );
  end if;

  return v_profile;
end;
$$;

revoke execute on function public.create_technician(jsonb, uuid[], jsonb, jsonb)
from public, anon;

grant execute on function public.create_technician(jsonb, uuid[], jsonb, jsonb)
to authenticated;
