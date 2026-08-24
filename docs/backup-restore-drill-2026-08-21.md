# Hosted Supabase Logical Backup and Restore Drill

## Executive summary

On 2026-08-21, a manual logical backup of the hosted TechFind Supabase project
was created, checksummed, encrypted with `age`, decrypted for verification, and
restored into an isolated temporary Supabase project.

The restore reproduced the migration history, Auth records, application data,
and database behavior. Database lint, the applicable SQL integration tests,
deployed Edge Functions, and manual frontend workflows all passed after the
required ACL hardening was reapplied.

The production project was not modified during the drill.

## Drill scope

| Item | Value |
| --- | --- |
| Date | 2026-08-21 |
| Repository branch | `feature/backup-and-recreation` |
| Source commit | `d49b9c124d84c2779968182f57adf46e333193a0` |
| Source project ref | `ybcvjxgymvynhvdkyqtp` |
| Temporary restore project ref | `kjjmennifskgzmlmseqz` |
| Supabase CLI | `2.115.0` |
| Encryption tool | `age 1.3.1` |
| Backup format version | `1.0` |

The temporary project contained no production secrets before the restore. It
was used only as the restore and validation target.

## Backup artifact

The verified encrypted artifact is:

```text
.backups/hosted/2026-08-21_115511-v2.zip.age
```

| Property | Value |
| --- | --- |
| Local size | 52,327 bytes |
| SHA-256 | `b2b2cc0a56d8080f2fb73d92403997c6a854526e3c513fbc9eb2118a99001225` |
| Encryption | `age` recipient encryption |
| Private key location | Outside the repository |
| Git tracking | `.backups/` is ignored by Git |

Only the encrypted `.age` artifact was copied to off-site storage. The archive
was uploaded to Google Drive as
`techfind-hosted-backup-2026-08-21_115511-v2.zip.age`. A subsequent remote read
confirmed that the object exists and has a non-zero size of 52,327 bytes,
matching the local encrypted file size.

[Open the verified off-site copy in Google Drive](https://drive.google.com/file/d/163y04Tl2ezM_LAooUJZs_WX_2fsIL89-/view?usp=drivesdk)

## Backup contents and integrity

The plaintext archive contained the following logical dump components before
the working copies were removed:

| File | Purpose | SHA-256 |
| --- | --- | --- |
| `roles.sql` | Database roles and role-related definitions | `25873cec56a2cc6514e204f420231777f85c03da818caa7090cdcdfa89776ecd` |
| `schema.sql` | Application database schema | `7fe1b824d795c5c5b52d78c7c9b731224381c1d7c30111c27fd55af3f5954c98` |
| `data.sql` | Application and platform table data | `ec4949af59742203ad63cd4f167026c3328dec4571e4e39ee0ced3ce995eb024` |
| `history_schema.sql` | Migration-history schema | `18b99fbbb3ec9fbb964bb255a56171329acd99b6977ece2addd89fdf5aa5105b` |
| `history_data.sql` | Migration-history records | `96197e83a4e8e958787fc76edf9b1923fe16439ed014abd0225a5c3021440d6f` |

`MANIFEST.json` contains the creation timestamp, source project ref, source
commit, tool version, file inventory, and data-coverage notes. It contains no
database credentials, access tokens, encryption keys, or user secrets.

Encryption and decryption were tested successfully. The V2 archive was
decrypted, its encrypted-archive hash matched the expected value, and every
payload checksum in `SHA256SUMS.txt` was confirmed before restore.

## Restore procedure and results

The logical dump was restored into the temporary project in dependency order:

1. roles;
2. schema;
3. application and platform data;
4. migration-history schema and records;
5. ACL hardening identified during validation;
6. Edge Functions from the tested Git revision.

The restored state contained:

| Restored item | Count or value |
| --- | ---: |
| Migration-history records | 23 |
| Latest migration | `20260814120000` |
| Auth users | 3 |
| Auth identities | 3 |
| User profiles | 3 |
| Technicians | 18 |
| Technician skills | 254 |
| Storage buckets | 0 |
| Storage objects | 0 |

The restored Auth users and identities were present and usable. Hosted Auth
configuration was not part of this logical restore and remains a separate
recovery responsibility.

## Validation results

| Check | Result |
| --- | --- |
| Migration history and latest version | Passed |
| Critical table row counts | Passed |
| Database lint against restored project | Passed |
| Applicable SQL integration tests | Passed |
| `demo_fixture_integration_test.sql` | Intentionally skipped |
| `create-user` Edge Function deployment | Passed |
| `update-user` Edge Function deployment | Passed |
| Frontend connection to restored project | Passed |
| Login workflow | Passed |
| Technician matching workflow | Passed |
| Management workflows | Passed |

`demo_fixture_integration_test.sql` was excluded because it validates the
deterministic fictional fixtures created by the local-only `supabase/seed.sql`.
Running it against restored hosted data would test an invalid assumption rather
than the integrity of the restore.

## Important finding: clean-project ACL drift

The clean Supabase restore target started with broader default privileges than
the production project. Restoring schema objects and data did not, by itself,
reproduce every security-sensitive privilege restriction expected by the
application.

The restored project required the ACL hardening encoded in the migrations to
be reapplied, including:

- column-level `UPDATE` grants for lifecycle-managed tables;
- removal of direct write access to archive metadata such as `archived_at`,
  `archived_by`, and `active_before_archive`;
- `REVOKE EXECUTE` from `public` and `anon` for security-sensitive RPCs;
- explicit `EXECUTE` grants only to the roles that require them.

This is a recovery-process defect, not a production regression: production
already had the intended ACLs, and the production project was not changed.

The restore procedure must therefore treat ACL verification and hardening as
an explicit post-restore gate. A restore is not accepted merely because the
schema and row counts match.

## Auth, Storage, and project configuration boundaries

The logical backup included database-resident Auth users and identities. It did
not capture all hosted Auth configuration, including redirect URLs, production
site URLs, SMTP configuration, provider settings, or secrets. Those settings
must be restored from a separate configuration inventory.

Storage was empty at the time of the drill. Database dumps can preserve Storage
metadata but do not contain the underlying object bytes. If Storage objects are
introduced, the backup process must separately export and verify bucket names,
object paths, metadata, and file bytes.

The logical dump also does not represent a complete Supabase project backup.
Deployed Edge Functions, function secrets, scheduled jobs, platform settings,
and deployment environment variables require separate source-controlled or
secret-managed recovery procedures.

## Recovery objectives

The backup snapshot was created at `2026-08-21T17:36:42.9290905Z`. Exact drill
start and restore-completion timestamps were not recorded, so achieved RPO and
RTO cannot be calculated reliably for this run. Future drills must record:

- timestamp of the newest source data included in the backup;
- restore start time;
- database restore completion time;
- application validation completion time.

Functional recoverability was demonstrated, but this drill does not provide
evidence that a specific time-based RPO or RTO target was met.

## Final state

- The production database was not modified.
- The encrypted V2 artifact remains available locally.
- A verified, non-empty encrypted off-site copy exists in Google Drive.
- All Phase 5 plaintext `.sql` and `.zip` working copies were removed after
  off-site verification. Only encrypted `.age` archives remain for this drill.
- The temporary Supabase project `kjjmennifskgzmlmseqz` was deleted at the end
  of the drill. A subsequent project-list check confirmed that the project ref
  was no longer present.

## Conclusion

The manual logical backup is decryptable and sufficient to recover the tested
database, Auth records, application data, Edge Functions, and frontend
workflows into an isolated Supabase project. The drill also identified a
material recovery requirement: ACL hardening must be explicitly reapplied and
verified on a clean target before that target can be considered secure or
production-equivalent.
