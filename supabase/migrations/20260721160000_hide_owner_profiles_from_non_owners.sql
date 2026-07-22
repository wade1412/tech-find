begin;

drop policy if exists "Main admins can read all profiles"
  on public.user_profile;

create policy "Admins can read profiles allowed by their role"
on public.user_profile
for select
to authenticated
using (
  public.current_user_has_role('main_admin'::public.app_role)
  and (
    public.current_app_role() = 'owner'::public.app_role
    or role <> 'owner'::public.app_role
  )
);

commit;
