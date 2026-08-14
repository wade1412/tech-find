begin;

alter table public.user_management_audit
  add column reconciled_at timestamptz,
  add column reconciled_by uuid,
  add column reconciliation_note text,
  add column last_alerted_at timestamptz,
  add column alert_count integer not null default 0,
  add constraint user_management_audit_alert_count_check
    check (alert_count >= 0),
  add constraint user_management_audit_reconciliation_state_check
    check (
      (
        reconciled_at is null
        and reconciled_by is null
        and reconciliation_note is null
      )
      or (
        reconciled_at is not null
        and reconciled_by is not null
        and nullif(btrim(reconciliation_note), '') is not null
      )
    );

create index user_management_audit_pending_reconciliation_idx
  on public.user_management_audit (created_at desc)
  where requires_reconciliation is true
    and reconciled_at is null;

create or replace function public.resolve_user_management_reconciliation(
  p_audit_id uuid,
  p_resolution_note text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_requires_reconciliation boolean;
  v_reconciled_at timestamptz;
  v_resolution_note text := nullif(pg_catalog.btrim(p_resolution_note), '');
begin
  if not exists (
    select 1
    from public.user_profile
    where id = auth.uid()
      and role = 'owner'
      and active is true
      and archived_at is null
  ) then
    raise exception 'Only an active owner can resolve reconciliation incidents'
      using errcode = '42501';
  end if;

  if v_resolution_note is null then
    raise exception 'Reconciliation note cannot be empty'
      using errcode = '22023';
  end if;

  select requires_reconciliation, reconciled_at
  into v_requires_reconciliation, v_reconciled_at
  from public.user_management_audit
  where id = p_audit_id
  for update;

  if not found then
    raise exception 'Audit record not found'
      using errcode = 'P0002';
  end if;

  if v_requires_reconciliation is not true then
    raise exception 'Audit record does not require reconciliation'
      using errcode = '22023';
  end if;

  if v_reconciled_at is not null then
    raise exception 'Reconciliation incident is already resolved'
      using errcode = '55000';
  end if;

  update public.user_management_audit
  set reconciled_by = auth.uid(),
      reconciliation_note = v_resolution_note,
      reconciled_at = statement_timestamp()
  where id = p_audit_id;
end;
$$;

revoke all
  on function public.resolve_user_management_reconciliation(uuid, text)
  from public;

grant execute
  on function public.resolve_user_management_reconciliation(uuid, text)
  to authenticated;

commit;
