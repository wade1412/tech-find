begin;

-- These helpers are used by authenticated RLS policies and privileged RPCs.
-- Anonymous callers do not need a direct PostgREST RPC surface for them.
revoke execute on function public.current_app_role() from public, anon;
revoke execute on function public.current_user_has_role(public.app_role)
  from public, anon;
revoke execute on function public.app_role_rank(public.app_role)
  from public, anon;
revoke execute on function public.resolve_user_management_reconciliation(uuid, text)
  from public, anon;

grant execute on function public.current_app_role()
  to authenticated, service_role;
grant execute on function public.current_user_has_role(public.app_role)
  to authenticated, service_role;
grant execute on function public.app_role_rank(public.app_role)
  to authenticated, service_role;
grant execute on function public.resolve_user_management_reconciliation(uuid, text)
  to authenticated, service_role;

-- An explicit empty search path prevents object-name shadowing. Both functions
-- only use PL/pgSQL/SQL built-ins and arguments, so they need no schema lookup.
alter function public.set_updated_at() set search_path = '';
alter function public.app_role_rank(public.app_role) set search_path = '';

commit;
