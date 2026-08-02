begin;

drop policy if exists "Active users can read specific issues"
  on public.specific_issue;
drop policy if exists "Authenticated users can read available specific issues"
  on public.specific_issue;
drop policy if exists "Active users can read available specific issues"
  on public.specific_issue;

create policy "Active users can read available specific issues"
on public.specific_issue
for select
to authenticated
using (
  public.current_app_role() is not null
  and (
    archived_at is null
    or public.current_user_has_role('main_admin'::public.app_role)
  )
);

commit;
