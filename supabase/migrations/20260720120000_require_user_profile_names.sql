begin;

-- Normalize existing profiles before enforcing the invariant. Prefer the other
-- display name, then the email local-part, and keep an id-based final fallback
-- so this migration is safe for every existing row.
update public.user_profile
set
  alias = coalesce(
    nullif(btrim(alias), ''),
    nullif(btrim(full_name), ''),
    nullif(split_part(email, '@', 1), ''),
    'User-' || left(id::text, 8)
  ),
  full_name = coalesce(
    nullif(btrim(full_name), ''),
    nullif(btrim(alias), ''),
    nullif(split_part(email, '@', 1), ''),
    'User ' || left(id::text, 8)
  );

alter table public.user_profile
  alter column alias set not null,
  alter column full_name set not null;

alter table public.user_profile
  add constraint user_profile_alias_not_blank
    check (char_length(btrim(alias)) > 0),
  add constraint user_profile_full_name_not_blank
    check (char_length(btrim(full_name)) > 0);

commit;
