\set ON_ERROR_STOP on

begin;

do $$
begin
  if has_function_privilege(
    'anon',
    'public.current_app_role()',
    'execute'
  ) then
    raise exception 'anon unexpectedly has execute access to current_app_role';
  end if;

  if has_function_privilege(
    'anon',
    'public.current_user_has_role(public.app_role)',
    'execute'
  ) then
    raise exception 'anon unexpectedly has execute access to current_user_has_role';
  end if;

  if has_function_privilege(
    'anon',
    'public.resolve_user_management_reconciliation(uuid,text)',
    'execute'
  ) then
    raise exception 'anon unexpectedly has execute access to reconciliation RPC';
  end if;

  if not has_function_privilege(
    'authenticated',
    'public.resolve_user_management_reconciliation(uuid,text)',
    'execute'
  ) then
    raise exception 'authenticated owner path lost execute access to reconciliation RPC';
  end if;

  if not exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'set_updated_at'
      and p.proconfig @> array['search_path=""']::text[]
  ) then
    raise exception 'set_updated_at does not have an empty search_path';
  end if;

  if not exists (
    select 1
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'app_role_rank'
      and p.proconfig @> array['search_path=""']::text[]
  ) then
    raise exception 'app_role_rank does not have an empty search_path';
  end if;
end;
$$;

set local role anon;

do $$
begin
  begin
    perform public.resolve_user_management_reconciliation(
      '00000000-0000-4000-8000-000000000001',
      'Anonymous attempt'
    );
    raise exception 'anonymous reconciliation call unexpectedly succeeded';
  exception when insufficient_privilege then null;
  end;
end;
$$;

rollback;

select 'security hardening integration tests passed' as result;
