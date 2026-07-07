-- 1. Create private schema for security helpers
create schema if not exists private;

revoke all on schema private from public;
revoke all on schema private from anon;

grant usage on schema private to authenticated;


-- 2. Auth helper for technician skills management
create or replace function private.current_user_can_manage_technician_skills()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (
    select 1
    from public.user_profile up
    where up.id = auth.uid()
      and up.active = true
      and up.role = any (
        array[
          'secondary_admin'::public.app_role,
          'main_admin'::public.app_role,
          'owner'::public.app_role
        ]
      )
  );
$$;

revoke execute on function private.current_user_can_manage_technician_skills()
from public, anon;

grant execute on function private.current_user_can_manage_technician_skills()
to authenticated;


-- 3. Ensure RLS is enabled
alter table public.technician_skill_set enable row level security;


-- 4. Normalize commercial before CHECK
update public.technician_skill_set
set commercial = false
where commercial is null;

alter table public.technician_skill_set
alter column commercial set default false;

alter table public.technician_skill_set
alter column commercial set not null;


-- 5. Guard before adding CHECK constraint
do $$
begin
  if exists (
    select 1
    from public.technician_skill_set
    where commercial::int
      + num_nonnulls(brand_group_id, specific_issue_id) <> 1
  ) then
    raise exception
      'Cannot add technician_skill_set_exactly_one_variant: invalid technician_skill_set rows still exist';
  end if;
end;
$$;


-- 6. Dedupe existing duplicated commercial skills
with ranked as (
  select
    id,
    row_number() over (
      partition by technician_id, unit_id
      order by id
    ) as rn
  from public.technician_skill_set
  where commercial = true
    and brand_group_id is null
    and specific_issue_id is null
)
delete from public.technician_skill_set tss
using ranked r
where tss.id = r.id
  and r.rn > 1;


-- 7. Dedupe existing duplicated brand group skills
with ranked as (
  select
    id,
    row_number() over (
      partition by technician_id, unit_id, brand_group_id
      order by id
    ) as rn
  from public.technician_skill_set
  where brand_group_id is not null
    and commercial = false
    and specific_issue_id is null
)
delete from public.technician_skill_set tss
using ranked r
where tss.id = r.id
  and r.rn > 1;


-- 8. Dedupe existing duplicated specific issue skills
with ranked as (
  select
    id,
    row_number() over (
      partition by technician_id, unit_id, specific_issue_id
      order by id
    ) as rn
  from public.technician_skill_set
  where specific_issue_id is not null
    and commercial = false
    and brand_group_id is null
)
delete from public.technician_skill_set tss
using ranked r
where tss.id = r.id
  and r.rn > 1;


-- 9. Recreate CHECK constraint
alter table public.technician_skill_set
drop constraint if exists technician_skill_set_exactly_one_variant;

alter table public.technician_skill_set
add constraint technician_skill_set_exactly_one_variant
check (
  commercial::int
  + (brand_group_id is not null)::int
  + (specific_issue_id is not null)::int = 1
);


-- 10. Recreate partial unique indexes deterministically
drop index if exists public.unique_commercial_skill;
drop index if exists public.unique_brand_group_skill;
drop index if exists public.unique_specific_issue_skill;

drop index if exists public.technician_skill_set_unique_commercial_variant;

create unique index technician_skill_set_unique_commercial_variant
on public.technician_skill_set (technician_id, unit_id)
where commercial = true
  and brand_group_id is null
  and specific_issue_id is null;


drop index if exists public.technician_skill_set_unique_brand_group_variant;

create unique index technician_skill_set_unique_brand_group_variant
on public.technician_skill_set (technician_id, unit_id, brand_group_id)
where brand_group_id is not null
  and commercial = false
  and specific_issue_id is null;


drop index if exists public.technician_skill_set_unique_specific_issue_variant;

create unique index technician_skill_set_unique_specific_issue_variant
on public.technician_skill_set (technician_id, unit_id, specific_issue_id)
where specific_issue_id is not null
  and commercial = false
  and brand_group_id is null;


-- 11. RLS SELECT policy
drop policy if exists "Authenticated users can read technician_skill_set"
on public.technician_skill_set;

drop policy if exists "Authenticated users can read technician skills"
on public.technician_skill_set;

create policy "Authenticated users can read technician skills"
on public.technician_skill_set
for select
to authenticated
using (true);


-- 12. RLS INSERT policy
drop policy if exists "Active admins can insert technician skills"
on public.technician_skill_set;

create policy "Active admins can insert technician skills"
on public.technician_skill_set
for insert
to authenticated
with check (
  (select private.current_user_can_manage_technician_skills())
);


-- 13. RLS DELETE policy
drop policy if exists "Active admins can delete technician skills"
on public.technician_skill_set;

create policy "Active admins can delete technician skills"
on public.technician_skill_set
for delete
to authenticated
using (
  (select private.current_user_can_manage_technician_skills())
);


-- 14. Table privileges
revoke all on table public.technician_skill_set from anon;
revoke all on table public.technician_skill_set from authenticated;

grant select, insert, delete
on table public.technician_skill_set
to authenticated;

-- 15. Drop old RPC before changing return type
drop function if exists public.update_technician_skills(
  uuid,
  jsonb,
  uuid[]
);


-- 16. Recreate RPC and return current saved skills
create function public.update_technician_skills(
  p_technician_id uuid,
  p_added_skills jsonb default '[]'::jsonb,
  p_removed_skill_ids uuid[] default '{}'::uuid[]
)
returns setof public.technician_skill_set
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_added_skills jsonb := coalesce(p_added_skills, '[]'::jsonb);
  v_removed_skill_ids uuid[] := coalesce(p_removed_skill_ids, '{}'::uuid[]);
begin
  if not (select private.current_user_can_manage_technician_skills()) then
    raise exception 'Insufficient permissions'
      using errcode = '42501';
  end if;

  if jsonb_typeof(v_added_skills) <> 'array' then
    raise exception 'p_added_skills must be a JSON array'
      using errcode = '22023';
  end if;

  -- Validate one and only one skill variant in each payload row.
  if exists (
    select 1
    from jsonb_to_recordset(v_added_skills) as skill(
      unit_id uuid,
      commercial boolean,
      brand_group_id uuid,
      specific_issue_id uuid
    )
    where skill.unit_id is null
      or coalesce(skill.commercial, false)::int
        + (skill.brand_group_id is not null)::int
        + (skill.specific_issue_id is not null)::int <> 1
  ) then
    raise exception 'Invalid technician skill payload: each skill must have exactly one variant'
      using errcode = '22023';
  end if;

  -- Validate unit exists and is active.
  if exists (
    select 1
    from jsonb_to_recordset(v_added_skills) as skill(
      unit_id uuid,
      commercial boolean,
      brand_group_id uuid,
      specific_issue_id uuid
    )
    left join public.unit u on u.id = skill.unit_id
    where u.id is null
      or u.active is not true
  ) then
    raise exception 'Invalid technician skill payload: unit does not exist or is inactive'
      using errcode = '22023';
  end if;

  -- Validate brand group exists and is active.
  if exists (
    select 1
    from jsonb_to_recordset(v_added_skills) as skill(
      unit_id uuid,
      commercial boolean,
      brand_group_id uuid,
      specific_issue_id uuid
    )
    left join public.brand_group bg on bg.id = skill.brand_group_id
    where skill.brand_group_id is not null
      and (
        bg.id is null
        or bg.active is not true
      )
  ) then
    raise exception 'Invalid technician skill payload: brand group does not exist or is inactive'
      using errcode = '22023';
  end if;

  -- Validate specific issue exists, is active, and belongs to the same unit.
  if exists (
    select 1
    from jsonb_to_recordset(v_added_skills) as skill(
      unit_id uuid,
      commercial boolean,
      brand_group_id uuid,
      specific_issue_id uuid
    )
    left join public.specific_issue si on si.id = skill.specific_issue_id
    where skill.specific_issue_id is not null
      and (
        si.id is null
        or si.active is not true
        or si.unit_id <> skill.unit_id
      )
  ) then
    raise exception 'Invalid technician skill payload: specific issue does not exist, is inactive, or belongs to another unit'
      using errcode = '22023';
  end if;

  -- Validate commercial skill is allowed for this unit.
  if exists (
    select 1
    from jsonb_to_recordset(v_added_skills) as skill(
      unit_id uuid,
      commercial boolean,
      brand_group_id uuid,
      specific_issue_id uuid
    )
    join public.unit u on u.id = skill.unit_id
    where coalesce(skill.commercial, false) = true
      and coalesce(u.can_be_commercial, false) = false
  ) then
    raise exception 'Invalid technician skill payload: commercial skill is not allowed for this unit'
      using errcode = '22023';
  end if;

  delete from public.technician_skill_set
  where technician_id = p_technician_id
    and id = any(v_removed_skill_ids);

  insert into public.technician_skill_set (
    technician_id,
    unit_id,
    commercial,
    brand_group_id,
    specific_issue_id
  )
  select
    p_technician_id,
    skill.unit_id,
    coalesce(skill.commercial, false),
    skill.brand_group_id,
    skill.specific_issue_id
  from jsonb_to_recordset(v_added_skills) as skill(
    unit_id uuid,
    commercial boolean,
    brand_group_id uuid,
    specific_issue_id uuid
  );

  return query
  select tss.*
  from public.technician_skill_set tss
  where tss.technician_id = p_technician_id
  order by
    tss.unit_id,
    tss.commercial desc,
    tss.brand_group_id,
    tss.specific_issue_id,
    tss.id;
end;
$$;


-- 17. Function privileges
revoke execute on function public.update_technician_skills(uuid, jsonb, uuid[])
from public, anon;

grant execute on function public.update_technician_skills(uuid, jsonb, uuid[])
to authenticated;

