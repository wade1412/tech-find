-- Permanently delete a technician and its cascade-owned relations.
-- Only active main admins and owners may execute this destructive action.
create or replace function public.delete_technician(
  p_technician_id uuid
)
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
      and up.role = any (
        array[
          'main_admin'::public.app_role,
          'owner'::public.app_role
        ]
      )
  ) then
    raise exception 'Insufficient permissions to delete technicians'
      using errcode = '42501';
  end if;

  delete from public.technician
  where id = p_technician_id
  returning id into v_deleted_id;

  if v_deleted_id is null then
    raise exception 'Technician not found'
      using errcode = 'P0002';
  end if;

  return v_deleted_id;
end;
$$;

revoke execute on function public.delete_technician(uuid)
from public, anon;

grant execute on function public.delete_technician(uuid)
to authenticated;
