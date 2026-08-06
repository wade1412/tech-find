begin;

-- The initial schema contained legacy camelCase constraints alongside their
-- canonical snake_case equivalents. Keeping both repeats the same FK checks
-- on every write without adding any integrity protection.
alter table public.technician_skill_set
  drop constraint if exists "technician_skill_set_brandGroupId_fkey",
  drop constraint if exists "technician_skill_set_specificIssueId_fkey",
  drop constraint if exists "technician_skill_set_unitId_fkey";

commit;
