begin;

-- Authorization must fail closed even if data is imported or repaired outside
-- the archive RPC. The RPC already sets active=false and bans the Auth user;
-- this constraint and role lookup make that lifecycle invariant explicit.
alter table public.user_profile
  add constraint user_profile_archived_users_inactive_check
  check (archived_at is null or active is false)
  not valid;

alter table public.user_profile
  validate constraint user_profile_archived_users_inactive_check;

create or replace function public.current_app_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select user_profile.role
  from public.user_profile
  where user_profile.id = auth.uid()
    and user_profile.active is true
    and user_profile.archived_at is null
  limit 1;
$$;

commit;
