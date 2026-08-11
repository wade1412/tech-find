begin;

-- Remove permissive read policies left behind by earlier policy renames. RLS
-- policies are OR-ed, so these stale `using (true)` policies otherwise bypass
-- the active-profile requirement.
drop policy if exists "Authenticated users can read technician ignore list"
  on public.technician_ignore_list;
drop policy if exists "Authenticated users can read technician skills"
  on public.technician_skill_set;

drop policy if exists "Authenticated users can read available units"
  on public.unit;
create policy "Active users can read available units"
  on public.unit for select to authenticated
  using (
    public.current_app_role() is not null
    and (
      archived_at is null
      or public.current_user_has_role('main_admin'::public.app_role)
    )
  );

commit;
