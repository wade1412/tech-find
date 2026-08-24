# Local Environment Recreation Report

## Summary

On 2026-08-20, the TechFind local development environment was rebuilt from an
empty local Supabase state. All migrations and `supabase/seed.sql` applied
successfully, the seeded data matched the expected fixture counts, and every
database, frontend, and focused end-to-end validation passed.

This result verifies that the repository can recreate a working local system
without relying on data retained by a previous Supabase run.

## Tested revision and environment

| Item | Value |
| --- | --- |
| Date | 2026-08-20 |
| Branch | `feature/backup-and-recreation` |
| Commit | `4658c2f` |
| Node.js | `v25.6.1` |
| Docker | `29.6.2` |
| Supabase CLI | `2.115.0` |
| Host `psql` | Not installed; SQL tests ran through the local database container |

## Recreation procedure

The following commands removed the previous local Supabase state, started a
new stack, and rebuilt the database from the repository's migrations and seed
file:

```powershell
npx supabase stop --no-backup
npx supabase start
npx supabase db reset
```

All three commands completed successfully. `db reset` applied every migration
in `supabase/migrations` and then loaded `supabase/seed.sql`, as configured in
`supabase/config.toml`.

> **Warning:** `npx supabase stop --no-backup` and `npx supabase db reset`
> intentionally discard local database data. They must not be used against a
> hosted project.

## Seed verification

The rebuilt database contained the expected deterministic fixture data:

| Table | Row count |
| --- | ---: |
| `brand` | 4 |
| `brand_group` | 2 |
| `service_zone` | 3 |
| `specific_issue` | 2 |
| `technician` | 7 |
| `technician_ignore_list` | 1 |
| `technician_service_zone` | 7 |
| `technician_skill_set` | 9 |
| `unit` | 6 |

These counts confirm that both the primary entities and their relationship
tables were recreated, rather than only the schema being restored.

## Validation results

| Check | Command or method | Result |
| --- | --- | --- |
| Database lint | `npx supabase db lint` | Passed with no errors |
| SQL integration suite | All nine `supabase/tests/*_test.sql` files | Passed |
| Generated database types | Regenerated locally and compared after normalization | No differences |
| ESLint | `npm run lint` | Passed |
| Unit and component tests | `npm run test:run` | Passed |
| Production build | `npm run build` | Passed |
| Demo users | `npm run demo:setup-users` | Passed |
| E2E user setup | `npm run test:e2e:setup` | Passed |
| Focused Playwright smoke tests | `npm run test:e2e:smoke` | Passed |

Because a host `psql` client was unavailable, the transactional SQL suite was
executed against PostgreSQL inside the local Supabase container:

```powershell
Get-ChildItem .\supabase\tests\*_test.sql | Sort-Object Name | ForEach-Object {
  Get-Content -Raw $_.FullName |
    docker exec -i supabase_db_tech-find `
      psql -v ON_ERROR_STOP=1 -U postgres -d postgres
}
```

`ON_ERROR_STOP=1` makes `psql` stop on the first SQL error, so a completed run
cannot silently ignore a failed assertion or statement.

## Scope and limitations

All database and Auth operations were performed against the local Supabase
instance. No command using `--linked` was run, and no hosted project was
modified.

This recreation validates repository-controlled local state:

- database migrations and seed data;
- local Auth and demo/E2E user setup;
- database policies, constraints, functions, and SQL integration behavior;
- generated TypeScript database types;
- frontend lint, tests, production compilation, and focused browser workflows.

It does **not** validate hosted-only configuration or external infrastructure,
including:

- Auth redirect URLs and production site URLs;
- SMTP provider configuration and email delivery;
- deployed Edge Function secrets;
- scheduled jobs;
- deployment-platform environment variables;
- hosted backup retention or restore behavior.

## Conclusion

The tested revision is locally reproducible from repository-controlled
migrations and seed data. No recreation or validation failure was observed.
