-- Unit management is available to active main admins and owners.
-- The frontend permission is UX only; RLS remains the authorization boundary.

create policy "Main admins can create units"
on public.unit
for insert
to authenticated
with check (public.current_user_has_role('main_admin'::public.app_role));

create policy "Main admins can update units"
on public.unit
for update
to authenticated
using (public.current_user_has_role('main_admin'::public.app_role))
with check (public.current_user_has_role('main_admin'::public.app_role));
