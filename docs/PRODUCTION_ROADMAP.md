# TechFind Production Readiness Roadmap

Last reviewed: 2026-08-07

This document is the persistent implementation plan for the next production-readiness stage of TechFind. It intentionally separates product UI from operational responsibilities such as backups, restore drills, and monitoring.

## How we will work

The implementation will be mentor-led but developer-written:

1. Take one small task from the current phase.
2. Write the code and tests yourself.
3. Ask for a review with the relevant diff or files.
4. The review checks correctness, security, maintainability, failure modes, and test value.
5. Fix review findings before starting the next dependency.

Do not implement several phases in one large branch. Security and CI changes are easier to reason about when each pull request has one explicit outcome.

## Current baseline

- React 19, React Router data router, TypeScript, Vite, TanStack Query, MUI, Tailwind, and Motion.
- Vitest suite: 49 files and 254 tests at the time this roadmap was created.
- Supabase CLI and local Docker configuration are present.
- Five transactional SQL integration tests exist in `supabase/tests`.
- No `.github/workflows` pipeline exists yet.
- Playwright is not installed yet.
- TOTP enrollment and verification are disabled in local `supabase/config.toml`.
- Local password policy is currently a minimum of 8 characters with no character-class requirement.
- Routes are lazy-loaded, but the main production entry chunk is approximately 568 kB minified.
- `user_management_audit.requires_reconciliation` exists, but there is no production alerting pipeline for it.

## Delivery order

| Phase | Outcome | Priority | Depends on |
| --- | --- | --- | --- |
| 1 | GitHub Actions quality gate | P0 | Existing tests |
| 2 | One local-Supabase Playwright lifecycle smoke test | P0 | Phase 1 |
| 3 | MFA enrollment, challenge, and `aal2` backend enforcement | P0 security | Phases 1–2 |
| 4 | Strong hosted password policy and leaked-password protection | P0 security | Phase 3 rollout plan |
| 5 | Root error boundary and recovery UI | P1 | Phase 1 |
| 6 | Production error monitoring and reconciliation alerts | P1 | Phase 5 |
| 7 | Bundle analysis and evidence-based optimization | P1 | Phase 1 |
| 8 | Encrypted off-site backups and restore drills | P1 operations | Phase 1 |
| 9 | Deterministic technician image export | P2 product | Stable filtering logic |

CI comes first because every later migration, security rule, and recovery feature needs an automated regression barrier. E2E comes before MFA because MFA changes the login state machine and needs a working browser harness.

---

## Phase 1 — GitHub Actions quality gate

### Goal

Every pull request and push to the integration branch must run this exact fail-fast chain:

```text
lint → unit/component tests → production build → Supabase DB lint → SQL integration tests
```

### Why this architecture

A single sequential quality job is the pragmatic first version. It preserves the requested order, produces one understandable failure point, and avoids starting the Supabase Docker stack more than once. Independent jobs can be introduced later if runtime becomes a real problem.

### Implementation steps

1. Create `.github/workflows/ci.yml`.
2. Trigger it for pull requests and pushes to `dev` and the production branch.
3. Add minimal workflow permissions: repository contents read-only.
4. Use a pinned Node major compatible with the local project and `npm ci`, not `npm install`.
5. Run existing commands in order:
   - `npm run lint`;
   - `npm run test:run`;
   - `npm run build`.
6. Start local Supabase with `npx supabase start`.
7. Run `npx supabase db lint` against the local stack.
8. Execute every `supabase/tests/*_integration_test.sql` file in sorted order with `ON_ERROR_STOP=1`.
9. Stop Supabase in an `if: always()` cleanup step.
10. Add job timeout and workflow concurrency so a newer commit can cancel an obsolete run for the same branch.

### SQL test runner decision

The current tests are transactional SQL scripts, not pgTAP files. Do not rename the command to `supabase test db` unless the suite is actually migrated to pgTAP.

For the first version, a small shell loop in the Ubuntu workflow is acceptable. If the same runner is needed on Windows locally, extract it into `scripts/run-sql-integration-tests.mjs` instead of maintaining separate Bash and PowerShell business logic.

The runner must:

- sort filenames;
- stop at the first failing SQL statement;
- print the current filename;
- return a non-zero exit code on failure;
- never connect to the hosted database.

### Acceptance criteria

- A deliberately broken ESLint rule fails before tests.
- A failing Vitest test prevents the build and DB steps.
- Invalid SQL or a broken migration fails DB lint or an integration test.
- All current SQL integration files are executed, not just the first match.
- No Supabase production secret is stored in the workflow.
- Branch protection can require the resulting `quality` check.

### Common mistakes

- Using `npm install`, which can change dependency resolution in CI.
- Adding service-role or hosted database secrets even though the stack is local.
- Running SQL tests without `ON_ERROR_STOP=1`, which can hide failures.
- Using `continue-on-error`, which converts a quality gate into informational logging.
- Uploading `dist` as an artifact before there is an actual deployment consumer.

References: [GitHub Actions workflows](https://docs.github.com/en/actions/concepts/workflows-and-actions/workflows), [Supabase CLI local development](https://supabase.com/docs/guides/local-development/cli/getting-started).

---

## Phase 2 — Playwright lifecycle smoke test on local Supabase

### Goal

One deterministic browser scenario verifies that the frontend, Auth, RLS/RPC, and lifecycle UI work together:

```text
login → create → edit → archive → restore → purge
```

This is a smoke test, not a second unit-test suite.

### Recommended first entity

Use a Service Zone for the first lifecycle test. It has the complete archive/restore/purge pipeline, no parent-entity dependencies, and a short form. That keeps the smoke test focused on system integration instead of spending most of its code constructing a complex technician draft.

Technician matching remains covered by focused unit tests. A separate technician E2E should only be added later if a production incident demonstrates missing browser coverage.

### Implementation steps

1. Install `@playwright/test` as a development dependency.
2. Add `playwright.config.ts`:
   - Chromium only initially;
   - one worker in CI;
   - retries only in CI;
   - trace on first retry;
   - screenshot on failure;
   - `baseURL` pointing to the local Vite server;
   - `webServer` that starts the app and reuses a local server outside CI.
3. Enable deterministic local seed/setup for one owner account.
4. Keep E2E credentials local and synthetic. Never use hosted owner credentials.
5. Generate local Supabase frontend environment values from `supabase status`; do not hardcode keys copied from a hosted project.
6. Create one test file such as `e2e/service-zone-lifecycle.spec.ts`.
7. Use a unique suffix in the zone name and slug so a failed previous run cannot cause a duplicate conflict.
8. Perform the complete lifecycle through visible UI controls.
9. Assert user-visible outcomes after every state transition, not internal implementation details.
10. Purge the test entity at the end. Add API-level cleanup as a fallback only for failed runs.
11. Upload the Playwright HTML report and traces only when the E2E job fails or is cancelled after producing artifacts.

### Recommended CI shape

Add a separate `e2e-smoke` job with `needs: quality`. It starts a fresh local Supabase stack and installs only Chromium with its OS dependencies. This keeps browser dependencies out of the fast quality job.

### What the test should assert

- Owner login reaches the authenticated application.
- Create redirects to the expected edit or list state.
- Edit persists after navigation or reload.
- Archive removes the entity from the normal list.
- Restore returns it with the expected active state.
- Purge removes it from the archive permanently.
- No unexpected browser console or page errors occur.

### What not to test here

- Every validation message.
- Every status filter combination.
- Every entity lifecycle.
- Exact Tailwind class names or DOM nesting.
- Production Supabase connectivity.

### Acceptance criteria

- The test passes locally against `supabase start`.
- It passes from a clean GitHub runner with one worker.
- A failure produces a useful trace/report artifact.
- The test is repeatable and leaves no persistent fixture.

Reference: [Playwright continuous integration](https://playwright.dev/docs/ci).

---

## Phase 3 — MFA and `aal2` enforcement

### Security decision

Require TOTP MFA for `owner`. Roll it out to `main_admin` immediately after the owner flow is proven. A privileged session must be `aal2` for management writes, archive/restore, purge, user-management Edge Functions, and sensitive owner reads.

Frontend-only route protection is not a security boundary. Supabase adds the Authenticator Assurance Level to the JWT; the database and Edge Functions must independently reject insufficient sessions.

### Important rollout constraint

Do not deploy restrictive `aal2` database enforcement before at least one owner has enrolled and verified a factor in the hosted project. Otherwise the owner can be locked out of every privileged recovery action.

### Implementation sequence

#### 3.1 Inventory the protected surface

Create a checklist of:

- direct table insert/update/delete policies;
- every archive, restore, and purge RPC;
- technician relationship RPCs;
- `create-user` and `update-user` Edge Functions;
- owner-only profile reads;
- any future backup/operations credentials, which must not be exposed through the app.

`SECURITY DEFINER` RPCs need explicit checks inside the function because they can bypass normal RLS behavior.

#### 3.2 Enable TOTP locally

In local config, enable TOTP enrollment and verification. Keep phone MFA disabled unless there is a real SMS operational requirement.

#### 3.3 Model the frontend auth state machine

After password authentication, call the MFA assurance-level API and distinguish:

```text
current aal1 + next aal1 → no enrolled factor
current aal1 + next aal2 → challenge required
current aal2            → privileged session ready
```

Add two routes:

- MFA setup/enrollment;
- MFA challenge/verification.

The setup flow enrolls a TOTP factor, displays the QR/secret, challenges it, verifies the code, and refreshes the session. Do not mark enrollment complete until verification succeeds.

#### 3.4 Add recovery-safe UX

- Encourage two verified TOTP factors for owners.
- Require an `aal2` session before unenrolling a factor.
- Do not let the UI remove the last factor from a privileged account without a clear recovery warning.
- Document the emergency owner recovery process through the Supabase project administrator.
- Never invent or store custom recovery codes unless a complete secure recovery design is implemented.

#### 3.5 Add database helpers and enforcement

Introduce a migration with a small helper that reads `auth.jwt()->>'aal'` and fails closed when the claim is missing.

Enforcement rules should be role-aware:

- normal active users can continue normal read access at `aal1`;
- privileged writes require `aal2` for `main_admin` and `owner`;
- owner-only purge requires both owner role and `aal2`;
- sensitive owner-profile reads require owner role and `aal2` where appropriate.

For table policies, restrictive policies are useful because they combine with existing permissive policies rather than accidentally replacing their intent. Review each policy instead of adding one global restriction that breaks normal reads.

#### 3.6 Enforce Edge Functions

After the gateway verifies the JWT, inspect the verified token claims in `create-user` and `update-user`. Reject privileged requests with a stable `403` error code such as `mfa_required` when `aal !== 'aal2'`.

Do not trust an `aal` value sent in the request body.

#### 3.7 Test both sides of every rule

SQL integration tests must create request JWT claims for both levels:

- eligible owner/main-admin with `aal1` is denied;
- the same actor with `aal2` succeeds;
- normal read behavior remains unchanged;
- missing `aal` fails as `aal1`;
- inactive and archived-account rules still win regardless of `aal2`.

Add frontend tests for assurance-level routing and challenge errors. Add an Edge Function test for `mfa_required` before relying on UI coverage.

#### 3.8 Hosted rollout

1. Deploy UI and challenge flow without mandatory backend enforcement.
2. Enable TOTP in hosted Auth settings.
3. Enroll and verify owner factors.
4. Confirm the owner session reports `aal2`.
5. Deploy database and Edge Function enforcement.
6. Verify owner management and purge paths.
7. Enroll all main admins.
8. Extend mandatory enforcement to main admins.
9. Keep a documented rollback migration and project-admin recovery procedure.

### Acceptance criteria

- A stolen password alone cannot perform privileged operations.
- Direct RPC/REST calls at `aal1` are rejected even if the frontend is bypassed.
- An `aal2` owner can complete all existing owner workflows.
- Main-admin and owner rollout cannot lock out all privileged accounts.
- MFA enrollment, challenge, unenrollment, and recovery behavior are documented.

References: [Supabase MFA guide](https://supabase.com/docs/guides/auth/auth-mfa), [Supabase TOTP flow](https://supabase.com/docs/guides/auth/auth-mfa/totp).

---

## Phase 4 — Hosted password security

### Recommended policy

- Minimum length: 12 characters.
- Required classes: lowercase, uppercase, digits, and symbols.
- Leaked-password protection: enabled when the project plan supports it.
- Secure password change / reauthentication: enabled.
- Password-manager guidance in invite and reset UI.

Long passwords provide more value than complexity alone, but the strongest hosted preset is appropriate for this small privileged user base where accounts can change operational data.

### Implementation steps

1. Mirror the intended policy in local `supabase/config.toml`.
2. Update client validation and helper text so the frontend does not promise weaker rules than Auth enforces.
3. Add tests for invite completion, password reset, and weak-password errors.
4. Update synthetic test credentials; do not commit real owner passwords.
5. Change hosted Auth settings during a controlled rollout window.
6. Enable leaked-password protection in hosted settings.
7. Verify existing-account login behavior and password-change behavior.
8. Add an operations checklist recording the hosted setting values because Dashboard-only configuration is not represented by a SQL migration.

### Acceptance criteria

- Local and hosted password requirements are documented and intentionally aligned.
- Weak/leaked password errors produce useful UI messages.
- Existing recovery and invite flows still work.
- No password or connection secret appears in Git history or CI logs.

Reference: [Supabase password security](https://supabase.com/docs/guides/auth/password-security).

---

## Phase 5 — Root error boundary and recovery UI

### Goal

Unexpected render errors and failed lazy imports must show a recoverable application screen instead of a blank page.

### Architecture

Use the React Router root route's error boundary/error element as the route-level safety net. Add a reusable error UI that can also be used by narrower feature boundaries later.

The UI should provide:

- a plain-language message;
- `Try again` for reset/revalidation where meaningful;
- `Reload application` for lazy chunk failures;
- a correlation/event ID after monitoring is added;
- no raw stack trace or sensitive backend message in production.

### Implementation steps

1. Create a root error component separate from normal page error states.
2. Attach it to the root data-router configuration.
3. Normalize lazy chunk/network errors separately from generic runtime errors.
4. Prevent infinite retry loops; one automatic chunk reload at most, then require user action.
5. Preserve useful development diagnostics while sanitizing production UI.
6. Add component tests for generic error and retry/reload actions.
7. Add one browser test that forces a failed lazy request or thrown route component.

### Trade-off

An error boundary cannot catch event-handler errors, arbitrary async callback errors, server failures represented as normal state, or errors thrown outside its React subtree. Those paths still need explicit handling and monitoring.

### Acceptance criteria

- A forced lazy chunk failure never leaves a blank root.
- Reload and retry actions are keyboard accessible.
- The original error reaches monitoring after Phase 6.

---

## Phase 6 — Production error monitoring

### Recommended scope

Use one monitoring provider for the frontend and Edge Functions, plus Supabase platform logs. Sentry is a practical default, but the provider decision should be made before adding SDK code.

### Frontend steps

1. Add the provider SDK with environment-specific DSN configuration.
2. Capture unhandled errors and unhandled promise rejections.
3. Connect the root error boundary to the SDK.
4. Add release/build identifiers and environment tags.
5. Upload source maps from CI without publishing them as public assets.
6. Scrub emails, JWTs, form values, and Supabase credentials.
7. Ignore known browser-extension noise only after observing real events.
8. Alert on new regressions and elevated error rate, not every isolated event.

### Edge Function steps

1. Add structured logging with operation, actor ID, target ID, outcome, and a request/correlation ID.
2. Capture uncaught exceptions from `create-user` and `update-user`.
3. Never log authorization headers, raw JWTs, passwords, or complete user payloads.
4. Propagate a safe correlation ID in error responses.
5. Use Supabase Function Invocations/Logs during initial rollout.
6. If the plan supports it, configure a Log Drain to the selected platform.

### Reconciliation alert

Create a scheduled server-side check for unresolved `user_management_audit.requires_reconciliation = true` rows. Alert once per audit record and track acknowledgement/resolution instead of repeatedly sending the same notification forever.

Do not poll this from an admin page: a production integrity warning must fire even when nobody has the application open.

### Acceptance criteria

- A deliberately generated frontend error appears with source maps and release metadata.
- A deliberately generated Edge Function error has the same correlation ID in response and logs.
- A reconciliation fixture triggers exactly one actionable alert.
- Sensitive values are absent from captured payloads.

References: [Supabase Edge Function logging](https://supabase.com/docs/guides/functions/logging), [Supabase Log Drains](https://supabase.com/docs/guides/telemetry/log-drains).

---

## Phase 7 — Bundle analysis and optimization

### Goal

Reduce initial JavaScript cost based on evidence, not only silence Vite's 500 kB warning.

### Important distinction

Splitting one 568 kB file into several vendor files does not automatically reduce downloaded or executed JavaScript. Vendor chunking can improve caching, but unused-code removal and deferring optional features produce actual transfer/execution savings.

### Implementation steps

1. Run `npm run build:analyze` and save the report locally.
2. Change analyzer configuration so CI never tries to open a browser automatically.
3. Record the largest modules and each entry chunk's minified and gzip sizes.
4. Audit MUI imports:
   - avoid barrel patterns that retain unused modules;
   - verify actual tree-shaking in the report before rewriting imports.
5. Audit Motion imports and ensure animation code is not pulled into routes that do not need it.
6. Identify components accidentally imported by the root layout rather than a lazy route.
7. Lazy-load rare dialogs/features only when measurement shows meaningful savings.
8. Add conservative `manualChunks` only for stable, cacheable vendors after measuring the before/after request graph.
9. Add a bundle budget script after a stable baseline exists.
10. Compare transfer size, parse/evaluation time, and route navigation—not only filename sizes.

### Acceptance criteria

- The report identifies what constitutes the current 568 kB entry.
- Every optimization has before/after measurements.
- No regression in lazy-route navigation or tests.
- The size budget fails CI only for meaningful regressions, with a documented threshold.

---

## Phase 8 — Backup and restore operations

### Architecture decision

Do not put backup or restore controls in React/admin UI. Database credentials and destructive restore authority belong in an isolated scheduled CI/server environment.

Use two recovery layers:

1. Supabase daily backups or PITR for operational recovery.
2. Encrypted logical dumps stored off-site for independent recovery and historical retention.

Database backups contain Storage metadata, not Storage object bytes. Objects must be exported separately.

### Backup implementation

1. Confirm the hosted plan's daily-backup/PITR capability and recovery window.
2. Create a dedicated scheduled workflow or server job, separate from pull-request CI.
3. Store `DB_URL` only in protected CI secrets. Prefer a dedicated least-privilege backup credential where supported.
4. Produce the documented dump set:

   ```bash
   supabase db dump --db-url "$DB_URL" -f roles.sql --role-only
   supabase db dump --db-url "$DB_URL" -f schema.sql
   supabase db dump --db-url "$DB_URL" -f data.sql --data-only --use-copy
   ```

5. Follow current Supabase exclusions for managed vector-storage tables when applicable.
6. Create a manifest containing timestamp, project reference, CLI version, Postgres version, migration head, and file sizes.
7. Generate SHA-256 checksums before encryption.
8. Encrypt the dump set with `age`, GPG, or cloud KMS before upload.
9. Upload to off-site object storage with object lock/versioning where available.
10. Apply lifecycle retention: 7 daily, 4 weekly, 12 monthly.
11. Export Storage object bytes separately through the S3-compatible API or Storage API and keep a matching manifest.
12. Alert when a scheduled backup is missing, too small, fails checksum, or cannot upload.

GitHub artifacts are useful for test reports, but they should not be the only off-site backup store.

### Monthly restore drill

1. Select a backup by manifest, not merely the newest filename.
2. Verify encrypted-object checksum, then decrypt in an ephemeral runner.
3. Create or allocate a temporary isolated Supabase project according to the official restore procedure.
4. Restore roles, schema, and data in the documented order with `ON_ERROR_STOP=1` and a transaction where supported.
5. Handle `auth`, `storage`, migration history, and encryption-root-key requirements exactly as required by the selected restore path.
6. Restore Storage object bytes separately.
7. Run integrity checks:
   - expected tables and migration head;
   - row-count ranges;
   - orphan checks for relationship tables;
   - owner isolation/RLS checks;
   - one read-only application smoke test.
8. Produce a restore report with duration, backup age, checksums, assertions, and failures.
9. Destroy the temporary project after the report is safely stored.
10. Alert if no successful restore drill exists for the current month.

Start with a manual restore drill before automating temporary project creation/deletion. This prevents a cleanup bug or misunderstood billing/API behavior from creating operational risk.

### Acceptance criteria

- A backup is not considered successful until checksum, encryption, and off-site upload succeed.
- A restore is proven, not assumed.
- Storage objects and database metadata are both covered.
- Production restore credentials never enter frontend code or normal PR workflows.
- Every monthly drill leaves an auditable report.

References: [Supabase database backups](https://supabase.com/docs/guides/platform/backups), [Supabase CLI backup and restore](https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore).

---

## Phase 9 — Technician JPEG/PNG export

### Goal

Export the current HomePage technician result as deterministic shareable images without screenshotting the responsive page.

### Architecture

```text
HomePage filters
      ↓
existing filtered/sorted technician result
      ↓
pure export pagination model
      ↓
fixed-width TechnicianExportPage component
      ↓
html-to-image → JPEG or PNG files
```

The selector/filtering result remains the single source of truth. Export code must not reimplement technician matching.

### Implementation steps

1. Add `html-to-image` only when this phase begins.
2. Extract or reuse the final filtered/sorted technician result from HomePage.
3. Create a dedicated `TechnicianExportPage` with a fixed width such as 1200 px.
4. Keep the export node off-screen but rendered; `display: none` cannot be captured reliably because it has no layout.
5. Include export metadata such as selected filters, generated time, and page number, but exclude sensitive/admin-only data.
6. Paginate the result into a bounded number of cards per image. Keep pagination as a pure tested function.
7. Wait for `document.fonts.ready` and all relevant images before capture.
8. Generate JPEG with a white background, explicit quality, pixel ratio, and cache busting.
9. Offer PNG as the sharper text-oriented alternative.
10. Use deterministic filenames containing filters/date/page number.
11. Revoke temporary object URLs and remove temporary anchors/nodes after download.
12. Show progress and a useful error if one page fails.
13. Test empty results, long names/notes, multiple pages, dark application theme, and mobile-triggered export.

### Canvas safety

Do not render an unbounded technician list into one canvas. Large canvas dimensions can exceed browser memory or implementation limits. Generate several fixed-size images instead.

### Acceptance criteria

- Export uses the exact visible business result and ordering.
- Output dimensions do not depend on the user's viewport.
- Long lists create multiple images without clipping.
- Light export styling remains consistent when the application is in dark mode.
- Pure pagination and filename logic have unit tests.

Reference: [html-to-image documentation](https://github.com/bubkoo/html-to-image).

---

## First implementation assignment

Implement only Phase 1: the GitHub Actions quality gate.

### Your task

1. Create `.github/workflows/ci.yml`.
2. Use one sequential `quality` job on `ubuntu-latest`.
3. Add checkout, Node setup with npm cache, and `npm ci`.
4. Run lint, test, and build in the required order.
5. Start local Supabase.
6. Run DB lint.
7. Run all five current SQL integration tests in sorted order with fail-fast behavior.
8. Always stop the local Supabase stack.
9. Add timeout, read-only permissions, and concurrency cancellation.
10. Do not add Playwright yet.

### What to send for review

- `.github/workflows/ci.yml`;
- any package script or runner file you add;
- the local command output showing the SQL runner executes all five files;
- any GitHub Actions failure you cannot explain.

### Review questions you should answer yourself first

- Can this workflow ever touch hosted Supabase?
- Does a failing SQL statement produce a non-zero exit code?
- Does cleanup run after a failed test?
- Are filenames deterministic and sorted?
- Is any secret unnecessary?
- Does the workflow duplicate logic that should live in a reusable script?

