begin;

alter table public.brand_group
  add column archived_at timestamptz,
  add column archived_by uuid references public.user_profile(id) on delete set null,
  add column active_before_archive boolean;

alter table public.brand
  add column archived_at timestamptz,
  add column archived_by uuid references public.user_profile(id) on delete set null,
  add column active_before_archive boolean,
  add column archived_via_group_id uuid
    references public.brand_group(id) on delete restrict;

create index brand_group_archived_at_idx
  on public.brand_group (archived_at);

create index brand_archived_at_idx
  on public.brand (archived_at);

create index brand_archived_via_group_id_idx
  on public.brand (archived_via_group_id)
  where archived_via_group_id is not null;

-- Lifecycle metadata is controlled exclusively by the archive RPCs.
revoke insert, update, delete on public.brand from anon, authenticated;
revoke insert, update, delete on public.brand_group from anon, authenticated;

grant insert (
  name,
  slug,
  active,
  group_id
) on public.brand to authenticated;

grant update (
  name,
  slug,
  active,
  group_id
) on public.brand to authenticated;

grant insert (
  name,
  slug,
  active,
  display_order
) on public.brand_group to authenticated;

grant update (
  name,
  slug,
  active,
  display_order
) on public.brand_group to authenticated;

drop policy if exists "Active users can read brand" on public.brand;
drop policy if exists "Authenticated users can read brand" on public.brand;

create policy "Active users can read available brands"
on public.brand
for select
to authenticated
using (
  public.current_app_role() is not null
  and (
    (
      archived_at is null
      and exists (
        select 1
        from public.brand_group bg
        where bg.id = brand.group_id
          and bg.archived_at is null
      )
    )
    or public.current_user_has_role('main_admin'::public.app_role)
  )
);

drop policy if exists "Active users can read brand groups"
  on public.brand_group;
drop policy if exists "Authenticated users can read brand_group"
  on public.brand_group;

create policy "Active users can read available brand groups"
on public.brand_group
for select
to authenticated
using (
  public.current_app_role() is not null
  and (
    archived_at is null
    or public.current_user_has_role('main_admin'::public.app_role)
  )
);

create policy "Main admins can create brands"
on public.brand
for insert
to authenticated
with check (
  public.current_user_has_role('main_admin'::public.app_role)
  and exists (
    select 1
    from public.brand_group bg
    where bg.id = brand.group_id
      and bg.archived_at is null
  )
);

create policy "Main admins can update available brands"
on public.brand
for update
to authenticated
using (
  archived_at is null
  and public.current_user_has_role('main_admin'::public.app_role)
)
with check (
  archived_at is null
  and public.current_user_has_role('main_admin'::public.app_role)
  and exists (
    select 1
    from public.brand_group bg
    where bg.id = brand.group_id
      and bg.archived_at is null
  )
);

create policy "Main admins can create brand groups"
on public.brand_group
for insert
to authenticated
with check (public.current_user_has_role('main_admin'::public.app_role));

create policy "Main admins can update available brand groups"
on public.brand_group
for update
to authenticated
using (
  archived_at is null
  and public.current_user_has_role('main_admin'::public.app_role)
)
with check (
  archived_at is null
  and public.current_user_has_role('main_admin'::public.app_role)
);

create or replace function public.archive_brand(p_brand_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_archived_id uuid;
begin
  if not exists (
    select 1
    from public.user_profile up
    where up.id = auth.uid()
      and up.active is true
      and up.archived_at is null
      and up.role = any (
        array[
          'main_admin'::public.app_role,
          'owner'::public.app_role
        ]
      )
  ) then
    raise exception 'Insufficient permissions to archive brands'
      using errcode = '42501';
  end if;

  update public.brand
  set archived_at = statement_timestamp(),
      archived_by = auth.uid(),
      active_before_archive = active,
      archived_via_group_id = null,
      active = false
  where id = p_brand_id
    and archived_at is null
  returning id into v_archived_id;

  if v_archived_id is null then
    if exists (select 1 from public.brand where id = p_brand_id) then
      raise exception 'Brand is already archived'
        using errcode = '22023';
    end if;

    raise exception 'Brand not found'
      using errcode = 'P0002';
  end if;

  return v_archived_id;
end;
$$;

create or replace function public.restore_brand(p_brand_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_brand public.brand%rowtype;
begin
  if not exists (
    select 1
    from public.user_profile up
    where up.id = auth.uid()
      and up.active is true
      and up.archived_at is null
      and up.role = any (
        array[
          'main_admin'::public.app_role,
          'owner'::public.app_role
        ]
      )
  ) then
    raise exception 'Insufficient permissions to restore brands'
      using errcode = '42501';
  end if;

  select *
  into v_brand
  from public.brand
  where id = p_brand_id
  for update;

  if not found then
    raise exception 'Brand not found'
      using errcode = 'P0002';
  end if;

  if v_brand.archived_at is null then
    raise exception 'Brand is not archived'
      using errcode = '22023';
  end if;

  if v_brand.archived_via_group_id is not null
    or exists (
      select 1
      from public.brand_group bg
      where bg.id = v_brand.group_id
        and bg.archived_at is not null
    )
  then
    raise exception 'Restore the parent brand group first'
      using errcode = '22023';
  end if;

  update public.brand
  set active = coalesce(active_before_archive, false),
      archived_at = null,
      archived_by = null,
      active_before_archive = null,
      archived_via_group_id = null
  where id = p_brand_id
  returning * into v_brand;

  return v_brand.id;
end;
$$;

create or replace function public.purge_brand(p_brand_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_deleted_id uuid;
begin
  if not exists (
    select 1
    from public.user_profile up
    where up.id = auth.uid()
      and up.active is true
      and up.archived_at is null
      and up.role = 'owner'::public.app_role
  ) then
    raise exception 'Insufficient permissions to permanently purge brands'
      using errcode = '42501';
  end if;

  delete from public.brand
  where id = p_brand_id
    and archived_at is not null
  returning id into v_deleted_id;

  if v_deleted_id is null then
    if exists (select 1 from public.brand where id = p_brand_id) then
      raise exception 'Brand must be archived before permanent purge'
        using errcode = '22023';
    end if;

    raise exception 'Brand not found'
      using errcode = 'P0002';
  end if;

  return v_deleted_id;
end;
$$;

create or replace function public.archive_brand_group(p_brand_group_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_group public.brand_group%rowtype;
begin
  if not exists (
    select 1
    from public.user_profile up
    where up.id = auth.uid()
      and up.active is true
      and up.archived_at is null
      and up.role = any (
        array[
          'main_admin'::public.app_role,
          'owner'::public.app_role
        ]
      )
  ) then
    raise exception 'Insufficient permissions to archive brand groups'
      using errcode = '42501';
  end if;

  select *
  into v_group
  from public.brand_group
  where id = p_brand_group_id
  for update;

  if not found then
    raise exception 'Brand group not found'
      using errcode = 'P0002';
  end if;

  if v_group.archived_at is not null then
    raise exception 'Brand group is already archived'
      using errcode = '22023';
  end if;

  update public.brand_group
  set archived_at = statement_timestamp(),
      archived_by = auth.uid(),
      active_before_archive = active,
      active = false
  where id = p_brand_group_id;

  update public.brand
  set archived_at = statement_timestamp(),
      archived_by = auth.uid(),
      active_before_archive = active,
      archived_via_group_id = p_brand_group_id,
      active = false
  where group_id = p_brand_group_id
    and archived_at is null;

  return p_brand_group_id;
end;
$$;

create or replace function public.restore_brand_group(p_brand_group_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_group public.brand_group%rowtype;
begin
  if not exists (
    select 1
    from public.user_profile up
    where up.id = auth.uid()
      and up.active is true
      and up.archived_at is null
      and up.role = any (
        array[
          'main_admin'::public.app_role,
          'owner'::public.app_role
        ]
      )
  ) then
    raise exception 'Insufficient permissions to restore brand groups'
      using errcode = '42501';
  end if;

  select *
  into v_group
  from public.brand_group
  where id = p_brand_group_id
  for update;

  if not found then
    raise exception 'Brand group not found'
      using errcode = 'P0002';
  end if;

  if v_group.archived_at is null then
    raise exception 'Brand group is not archived'
      using errcode = '22023';
  end if;

  update public.brand_group
  set active = coalesce(active_before_archive, false),
      archived_at = null,
      archived_by = null,
      active_before_archive = null
  where id = p_brand_group_id;

  update public.brand
  set active = coalesce(active_before_archive, false),
      archived_at = null,
      archived_by = null,
      active_before_archive = null,
      archived_via_group_id = null
  where archived_via_group_id = p_brand_group_id;

  return p_brand_group_id;
end;
$$;

create or replace function public.purge_brand_group(p_brand_group_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_group public.brand_group%rowtype;
begin
  if not exists (
    select 1
    from public.user_profile up
    where up.id = auth.uid()
      and up.active is true
      and up.archived_at is null
      and up.role = 'owner'::public.app_role
  ) then
    raise exception
      'Insufficient permissions to permanently purge brand groups'
      using errcode = '42501';
  end if;

  select *
  into v_group
  from public.brand_group
  where id = p_brand_group_id
  for update;

  if not found then
    raise exception 'Brand group not found'
      using errcode = 'P0002';
  end if;

  if v_group.archived_at is null then
    raise exception 'Brand group must be archived before permanent purge'
      using errcode = '22023';
  end if;

  if exists (
    select 1
    from public.brand
    where group_id = p_brand_group_id
      and archived_at is null
  ) then
    raise exception 'Brand group contains an available brand'
      using errcode = '23514';
  end if;

  delete from public.brand
  where group_id = p_brand_group_id;

  delete from public.brand_group
  where id = p_brand_group_id;

  return p_brand_group_id;
end;
$$;

revoke execute on function public.archive_brand(uuid) from public, anon;
revoke execute on function public.restore_brand(uuid) from public, anon;
revoke execute on function public.purge_brand(uuid) from public, anon;
revoke execute on function public.archive_brand_group(uuid) from public, anon;
revoke execute on function public.restore_brand_group(uuid) from public, anon;
revoke execute on function public.purge_brand_group(uuid) from public, anon;

grant execute on function public.archive_brand(uuid) to authenticated;
grant execute on function public.restore_brand(uuid) to authenticated;
grant execute on function public.purge_brand(uuid) to authenticated;
grant execute on function public.archive_brand_group(uuid) to authenticated;
grant execute on function public.restore_brand_group(uuid) to authenticated;
grant execute on function public.purge_brand_group(uuid) to authenticated;

commit;
