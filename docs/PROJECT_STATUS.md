# TechFind Project Status and Development Policy

**Status:** Active educational development

**Scope state:** New features are being added to the completed baseline

**Initial scope completion date:** 2026-08-24

**Feature development resumed:** 2026

## Purpose

TechFind is a learning project built in the style of a small SaaS application. It demonstrates practical frontend, Supabase, database, authorization, testing, recovery, and operational-documentation skills in one coherent system. The initial scope was completed on 2026-08-24, and the repository is now used for further feature development.

It is not an active customer deployment or an unattended production service. The initial completion milestone means that the original educational scope was implemented and validated.
New features are being added for personal use and

## Completed baseline

- technician matching by units, zones, brands, skills, issues, and job capabilities;
- technician, user, and reference-data management workflows;
- authentication, role-based access, protected routes, and database-level authorization;
- archive, restore, audit, and restricted purge workflows;
- transactional database RPCs for multi-step writes;
- deterministic demo fixtures and isolated local Auth users;
- Supabase migrations, generated database types, local database recreation, and SQL integration tests;
- frontend unit/component tests, Playwright smoke coverage, build validation, and CI quality gates;
- local recovery from migrations and seed data;
- a manual encrypted logical backup and restore drill documented in [backup-restore-drill-2026-08-21.md](backup-restore-drill-2026-08-21.md);
- local recreation and validation documented in [local-recreation-2026-08-20.md](local-recreation-2026-08-20.md).

## Intentional boundaries

The following items remain outside the current educational scope:

- scheduled unattended backup automation and long-term retention automation;
- an always-on reconciliation monitor for Auth/profile drift;
- external production monitoring, alerting, support operations, billing, and SLA management;
- multi-tenant isolation and commercial subscription management;
- production SMTP, deployment ownership, customer onboarding, and hosted-service operations;
- optional UI polish such as broader accessibility review, responsive refinement, image export, and bundle-budget enforcement.

These would belong to a separate productionization effort with different operational and business requirements.

## Ongoing development policy

Feature work continues in this repository. The appliance-installation matching feature is an example: it adds unit and technician capabilities, Job Option behavior, and focused tests. Future features should update this document and the relevant workflow documentation when their behavior is settled.

The installation schema migrations default both capability flags to `false`. The list of eligible units and technicians is environment data and is not reproduced by these migrations; configure and verify it when preparing a new database.

For each change:

- describe the user-facing behavior and any database changes in the pull request;
- add focused tests for changed business rules and database behavior, with end-to-end tests where a full browser workflow is the important risk;
- run lint, tests, build, and relevant local Supabase checks before opening the pull request;
- merge only after the `quality-gate` and `e2e-smoke` CI jobs pass;
- apply migrations before deploying frontend code that reads the changed schema.

The existing recovery and operational documents remain references; new feature work does not imply that hosted-service operations or commercial commitments have been implemented.

## Local demonstration

The project can be demonstrated locally with the documented demo workflow:

```powershell
npm run demo:reset
npm run demo:setup-users
npm run demo:dev
```

The repository, migrations, fixtures, tests, recovery reports, and operational references form the baseline for further development.
