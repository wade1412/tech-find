begin;

create table public.user_management_audit (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null,
  target_user_id uuid,
  operation text not null
    check (operation in ('create', 'update')),
  outcome text not null
    check (outcome in ('succeeded', 'failed', 'conflict')),
  before_state jsonb,
  after_state jsonb,
  error_message text,
  requires_reconciliation boolean not null default false,
  created_at timestamptz not null default now()
);

create index user_management_audit_actor_created_idx
  on public.user_management_audit (actor_id, created_at desc);

create index user_management_audit_target_created_idx
  on public.user_management_audit (target_user_id, created_at desc);

alter table public.user_management_audit enable row level security;

revoke all on table public.user_management_audit from anon, authenticated;
grant all on table public.user_management_audit to service_role;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'user_profile'
  ) then
    alter publication supabase_realtime add table public.user_profile;
  end if;
end;
$$;

drop policy if exists "Authenticated users can read brand"
  on public.brand;
create policy "Active users can read brand"
  on public.brand for select to authenticated
  using (public.current_app_role() is not null);

drop policy if exists "Authenticated users can read brand_group"
  on public.brand_group;
create policy "Active users can read brand groups"
  on public.brand_group for select to authenticated
  using (public.current_app_role() is not null);

drop policy if exists "Authenticated users can read service_zone"
  on public.service_zone;
create policy "Active users can read service zones"
  on public.service_zone for select to authenticated
  using (public.current_app_role() is not null);

drop policy if exists "Authenticated users can read specific_issue"
  on public.specific_issue;
create policy "Active users can read specific issues"
  on public.specific_issue for select to authenticated
  using (public.current_app_role() is not null);

drop policy if exists "Authenticated users can read technician"
  on public.technician;
drop policy if exists "Authenticated users can read available technicians"
  on public.technician;
create policy "Active users can read available technicians"
  on public.technician for select to authenticated
  using (
    public.current_app_role() is not null
    and (
      archived_at is null
      or public.current_user_has_role('main_admin'::public.app_role)
    )
  );

drop policy if exists "Authenticated users can read technician_ignore_list"
  on public.technician_ignore_list;
create policy "Active users can read technician ignore list"
  on public.technician_ignore_list for select to authenticated
  using (public.current_app_role() is not null);

drop policy if exists "Authenticated users can read technician_service_zone"
  on public.technician_service_zone;
create policy "Active users can read technician service zones"
  on public.technician_service_zone for select to authenticated
  using (public.current_app_role() is not null);

drop policy if exists "Authenticated users can read technician_skill_set"
  on public.technician_skill_set;
create policy "Active users can read technician skills"
  on public.technician_skill_set for select to authenticated
  using (public.current_app_role() is not null);

drop policy if exists "Authenticated users can read unit"
  on public.unit;
create policy "Active users can read units"
  on public.unit for select to authenticated
  using (public.current_app_role() is not null);

commit;
