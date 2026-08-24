# TechFind Production-Readiness Operations Guide

This guide is a production-readiness exercise explaining how backups and user-management reconciliation monitoring should be operated if TechFind is deployed as a hosted service. TechFind is currently an independently maintained learning project, not an active customer deployment. The guide intentionally keeps credentials out of the repository.

## Project completion status

TechFind is a completed educational project as of 2026-08-24. The application demonstrates the core SaaS-style workflows and the documented manual database backup/restore process, but it is not an active customer deployment and does not claim unattended production-service guarantees.

The scheduled backup automation, recurring reconciliation monitor, and external operational alerting described in this guide are reference procedures for learning and future adaptation. They are not unfinished feature work for this project. No further feature development is planned; this guide is retained as an operational reference for the completed implementation.

## Operating targets

The reference targets for a future small deployment are:

| Area | Target |
| --- | --- |
| Database recovery point objective (RPO) | No more than 24 hours of data loss |
| Recovery time objective (RTO) | Commercially reasonable target of 2 business days |
| Backup retention | 7 daily, 4 weekly, and 12 monthly encrypted copies |
| Restore verification | One restore drill every month |
| Reconciliation check | Every 15 minutes |
| Reconciliation reminder | Immediately, then at most once every 24 hours until resolved |

These are design targets, not an uptime or recovery guarantee. They should become contractual targets only after the automation has been implemented, tested, and shown to meet them consistently.

## Password security on the current Supabase plan

TechFind enforces a minimum of 12 characters plus lowercase, uppercase, and numeric characters in both the frontend and hosted Auth configuration. Symbols are intentionally optional. Custom SMTP is configured; the current limit of 30 authentication emails per hour is sufficient for the expected 10–20 users, but delivery should still be checked after any SMTP or DNS change.

Supabase leaked-password protection uses Have I Been Pwned and is available only on eligible paid plans. It is intentionally disabled for the current deployment because the hosted project cannot enable it. The related Security Advisor warning is therefore an accepted limitation, not a migration failure. Compensating controls are:

1. Require the existing 12-character policy.
2. Ask users to use a password manager and a unique password.
3. Keep secure password change/reauthentication enabled.
4. Monitor failed sign-ins and Auth email delivery.
5. Re-evaluate leaked-password protection before adding another customer or moving to a paid Supabase plan.

Do not weaken the local policy merely to remove a hosted warning, and do not claim that compromised-password screening is active while the project remains on an unsupported plan.

## Part 1: Backup and restore

### Why two backup layers are needed

TechFind should use both:

1. Supabase platform recovery, when available on the selected plan.
2. An encrypted logical dump stored outside Supabase and outside the developer computer.

The second layer protects against project deletion, provider-account problems, accidental schema changes, and failures that are copied into the provider backup. Free-plan projects do not include the same daily backup guarantees as paid projects, so scheduled logical dumps are essential.

Database dumps contain Storage metadata but not the underlying Storage objects. If TechFind starts using Supabase Storage, export those objects separately.

### One-time preparation

1. Choose off-site object storage. Recommended options are AWS S3, Cloudflare R2, Backblaze B2, or another S3-compatible service.
2. Create a private bucket dedicated to TechFind backups.
3. Disable public access and enable provider-side encryption and object versioning.
4. Create credentials that can write only to this backup bucket.
5. Generate an `age` encryption key pair on a trusted offline machine:

```powershell
age-keygen -o techfind-backup-private-key.txt
age-keygen -y techfind-backup-private-key.txt
```

6. Store the private key in two protected locations. Do not put it in GitHub, Supabase, Vercel, or the backup bucket.
7. Put only the public recipient key in GitHub Actions as `BACKUP_AGE_RECIPIENT`.
8. Add these GitHub Actions secrets:

```text
TECHFIND_DB_URL
BACKUP_AGE_RECIPIENT
BACKUP_BUCKET
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
AWS_ENDPOINT_URL        # only for an S3-compatible provider such as R2/B2
```

Use the Supabase Session Pooler connection string for `TECHFIND_DB_URL`. Never prefix a database secret with `VITE_`.

### Manual backup before the first rollout

Create an ignored working directory outside tracked source files:

```powershell
$backupStamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$backupRoot = Join-Path ".backups/hosted" $backupStamp
New-Item -ItemType Directory -Path $backupRoot | Out-Null
```

Create the three logical dumps:

```powershell
npx supabase db dump --db-url "$env:TECHFIND_DB_URL" -f "$backupRoot/roles.sql" --role-only
npx supabase db dump --db-url "$env:TECHFIND_DB_URL" -f "$backupRoot/schema.sql"
npx supabase db dump --db-url "$env:TECHFIND_DB_URL" -f "$backupRoot/data.sql" --data-only --use-copy
```

Create checksums before encryption:

```powershell
Get-ChildItem $backupRoot -File |
  Get-FileHash -Algorithm SHA256 |
  ForEach-Object { "$($_.Hash.ToLower())  $([IO.Path]::GetFileName($_.Path))" } |
  Set-Content "$backupRoot/SHA256SUMS.txt"
```

Archive and encrypt the backup:

```powershell
tar -czf "$backupRoot.tar.gz" -C $backupRoot .
age -r "$env:BACKUP_AGE_RECIPIENT" -o "$backupRoot.tar.gz.age" "$backupRoot.tar.gz"
```

Upload only the encrypted `.age` file to off-site storage. A backup is successful only after the upload completes and the remote object exists.

Delete the unencrypted `.sql` and `.tar.gz` working copies after verifying the upload. Keep the encrypted local copy only if the machine uses full-disk encryption.

### Scheduled GitHub Actions backup

Create `.github/workflows/backup.yml` only after the manual process succeeds.

The workflow should:

1. Run daily using `schedule` and also support `workflow_dispatch`.
2. Install the pinned Supabase CLI and `age` versions.
3. Create roles, schema, and data dumps.
4. Create `SHA256SUMS.txt` and a small manifest containing timestamp, commit SHA, and migration list.
5. Compress and encrypt the package with the public `age` recipient.
6. Upload the encrypted package to off-site object storage.
7. Verify that the uploaded object exists and has a non-zero size.
8. Mark the workflow successful only after verification.
9. Apply retention in object storage: 7 daily, 4 weekly, and 12 monthly copies.
10. Never use GitHub artifacts as the only backup destination.

Do not print `TECHFIND_DB_URL`, access tokens, dump contents, or decrypted data in workflow logs.

### Storage object backup

If `storage.objects` contains records, configure a separate object export using the Supabase S3-compatible endpoint or an approved storage copy tool. Preserve bucket name, object path, content type, and object bytes. Database restore alone cannot recover deleted files.

### Monthly restore drill

Perform the first restore manually before automating it:

1. Create a temporary Supabase project that contains no production users or secrets.
2. Download one encrypted off-site backup.
3. Decrypt and extract it:

```powershell
age -d -i techfind-backup-private-key.txt -o restore.tar.gz techfind-backup.tar.gz.age
tar -xzf restore.tar.gz -C restore
```

4. Recalculate SHA-256 hashes and compare them with `SHA256SUMS.txt`.
5. Obtain the temporary project's database connection string.
6. Restore in order:

```powershell
psql "$env:RESTORE_DB_URL" -v ON_ERROR_STOP=1 -f restore/roles.sql
psql "$env:RESTORE_DB_URL" -v ON_ERROR_STOP=1 -f restore/schema.sql
psql "$env:RESTORE_DB_URL" -v ON_ERROR_STOP=1 -f restore/data.sql
```

7. Verify migration history and row counts for critical tables.
8. Run database lint and the SQL integration suite against the restored project where safe.
9. Connect a temporary frontend deployment and run the Playwright smoke workflow.
10. Record start time, finish time, failures, fixes, achieved RPO, and achieved RTO.
11. Delete the temporary project only after documenting the successful result.

Never test a destructive restore directly against the live production project.

### Backup failure response

If a scheduled backup fails:

1. Treat one failed run as a high-priority operational issue.
2. Inspect only sanitized workflow logs.
3. Retry manually after fixing the cause.
4. Confirm the remote encrypted object exists.
5. Escalate to a critical incident if no verified backup has succeeded within 24 hours.

## Part 2: Reconciliation monitoring

### What reconciliation means

User creation and update span Supabase Auth and `public.user_profile`. If one side succeeds and rollback of the other side fails, the Edge Function writes an audit record with:

```text
requires_reconciliation = true
reconciled_at = null
```

The application is protecting data correctly, but a human must inspect and repair the mismatch. Monitoring makes sure that record is not silently ignored.

### Recommended architecture

```text
Supabase Cron (every 15 minutes)
  -> monitor-reconciliation Edge Function
  -> query unresolved user_management_audit rows with service-role access
  -> send a minimal alert through an HTTPS notification provider
  -> update last_alerted_at and alert_count after successful delivery
  -> owner investigates and resolves the incident through the owner-only RPC
```

Do not implement this as React polling. The monitor must run even when nobody has the application open.

### Step 1: Choose an alert channel

Use an HTTPS API rather than direct SMTP from the Edge Function. Suitable options include an email API, Slack webhook, Microsoft Teams workflow, or Telegram bot.

Create a dedicated alert destination and store its credentials only as Edge Function secrets. Do not include JWTs, authorization headers, passwords, full form payloads, or complete `before_state`/`after_state` objects in alerts.

### Step 2: Create `monitor-reconciliation`

The Edge Function should:

1. Accept only `POST`.
2. Require a random `x-monitor-secret` header.
3. Compare that header with `RECONCILIATION_MONITOR_SECRET` stored as an Edge Function secret.
4. Create a Supabase admin client with `SUPABASE_SECRET_KEY` or `SUPABASE_SERVICE_ROLE_KEY`.
5. Query records where:

```sql
requires_reconciliation is true
and reconciled_at is null
and (
  last_alerted_at is null
  or last_alerted_at < now() - interval '24 hours'
)
```

6. Order oldest incidents first and apply a small limit such as 20.
7. Send one summarized alert containing audit ID, operation, age, target user ID, and a sanitized error category.
8. Only after successful delivery, update `last_alerted_at = now()` and increment `alert_count`.
9. Return counts such as `found`, `alerted`, and `failed`; never return sensitive audit payloads.
10. Log identifiers and status, but not secrets or full user data.

Deploy the function with custom-secret authentication. If JWT verification is disabled for the cron endpoint, the random monitor secret becomes mandatory and must be validated before any database query.

### Step 3: Store scheduler secrets

Generate a random monitor secret of at least 32 bytes. Store the same value:

- as the Edge Function secret `RECONCILIATION_MONITOR_SECRET`;
- in Supabase Vault for the Cron request header.

Also store the project URL in Vault. Never write either value directly into a migration.

### Step 4: Schedule the function

Enable Supabase Cron and `pg_net`, then create a job through Dashboard → Integrations → Cron or reviewed SQL. Use this schedule:

```text
*/15 * * * *
```

The HTTP request should read the project URL and monitor secret from Vault and send:

```text
Content-Type: application/json
x-monitor-secret: <Vault secret>
```

Cron run history is available in `cron.job_run_details`. Check that the job has a successful run after deployment.

### Step 5: Resolution procedure

When an alert arrives:

1. Open Supabase Auth and locate the target Auth user.
2. Inspect the corresponding `user_profile` row.
3. Compare the audit operation and sanitized before/after states.
4. Decide which side is authoritative.
5. Repair Auth or profile state using an approved admin procedure.
6. Verify that login and role restrictions behave correctly.
7. As the owner, call:

```sql
select public.resolve_user_management_reconciliation(
  '<audit-id>',
  '<what was checked, what was repaired, and why>'
);
```

8. Confirm `reconciled_at`, `reconciled_by`, and `reconciliation_note` are populated.
9. Confirm the next scheduled run does not alert on that incident.

Never mark an incident resolved merely to silence an alert.

### Step 6: Acceptance test

Before enabling production alerts:

1. Insert an isolated synthetic reconciliation audit row in a controlled environment.
2. Invoke the monitor manually with the correct secret.
3. Confirm exactly one alert is delivered.
4. Confirm `last_alerted_at` and `alert_count` change only after delivery.
5. Invoke it again and confirm the 24-hour cooldown prevents a duplicate alert.
6. Resolve the row through the owner RPC.
7. Confirm future runs ignore it.
8. Invoke with a wrong secret and confirm no database information is returned.

## References

- [Supabase database backups](https://supabase.com/docs/guides/platform/backups)
- [Supabase CLI backup and restore](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore)
- [Supabase Cron](https://supabase.com/docs/guides/cron)
- [Scheduling Edge Functions](https://supabase.com/docs/guides/functions/schedule-functions)
- [Edge Function logging](https://supabase.com/docs/guides/functions/logging)
- [Supabase password security](https://supabase.com/docs/guides/auth/password-security)
