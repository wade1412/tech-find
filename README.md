# 🔍 TechFind

TechFind is a React and TypeScript application that helps appliance-repair dispatchers find technicians who match a service request.

The production-readiness implementation plan is tracked in [docs/PRODUCTION_ROADMAP.md](docs/PRODUCTION_ROADMAP.md).

Matching is based on appliance units, service zones, brands, specific issues, job requirements, technician skills, capabilities, and technician-specific ignore rules. The project is built as a portfolio and learning application around realistic business rules, frontend architecture, authentication, authorization, and Supabase-backed data.

## 🔁 Core Workflows

### 👷 Technician Matching

Dispatchers can build a service request using:

- one or more appliance units;
- a service zone;
- brands and brand groups;
- unit-specific issues;
- gas, stacked, built-in, and commercial requirements.

The application filters active, non-archived technicians and shows the technicians who satisfy the complete request.

### 📝 Result Ordering

Matching results support:

- default ordering;
- sorting by technician name;
- sorting by home ZIP code;
- ascending and descending directions;
- temporary drag-and-drop reordering on desktop.

Changing the filters or selected sort resets the custom order to the corresponding sorted result.

Drag reordering is disabled on mobile to preserve predictable touch scrolling.

### ⚙️ Technician Management

Authorized administrators can:

- search technicians by profile data and service zone;
- filter technicians by active status;
- create a technician through an atomic database operation;
- open a dedicated technician edit page;
- update profile information and daily job capacity;
- enable or disable technician capabilities;
- activate or deactivate a technician;
- update service zones, skills, and ignore-list rules;
- use skill templates and skill search when creating a technician;
- clear a new technician's skill draft with confirmation;
- archive and restore technicians without losing related data.

Creating a technician requires a valid profile and capabilities, at least one service zone, and at least one skill. Ignore-list rules are optional. The database generates the technician ID.

Profile and relationship updates use normalized form state, client-side validation, minimal patches, Supabase mutations or RPCs, and TanStack Query invalidation.

### 🗄️ Technician Archive

The technician lifecycle separates reversible archive operations from permanent deletion:

- `main_admin` and `owner` can archive and restore technicians;
- archived technicians are excluded from matching and regular management lists;
- the previous active status is restored when a technician leaves the archive;
- service zones, skills, and ignore-list items remain intact while archived;
- `main_admin` and `owner` can permanently purge an already archived technician;
- permanent purge remains an explicit cascade delete in a separate danger zone.

Permissions and lifecycle invariants are enforced in PostgreSQL, not only in the frontend.

### 🧰 Service Catalog Management

`main_admin` and `owner` can manage the complete service catalog from one sectioned workspace:

- units and their built-in, gas, commercial, and stacked capabilities;
- brand groups and the brands assigned to them;
- unit-specific issues;
- service zones;
- status filters and normalized multi-term search for every section;
- create and edit forms with normalized values, field validation, and duplicate-conflict messages;
- reversible archive and restore workflows;
- permanent purge for `main_admin` and `owner`.

Inactive entities remain configured but are excluded from active workflows. Archived entities are removed from normal management lists while their previous active state and dependent relationships are preserved where restoration requires them. Brand availability is derived from both the brand and its parent group, and specific-issue availability also depends on its parent unit.

### 👥 User Management

`main_admin` and `owner` can search, filter, create, edit, deactivate, archive, and restore user accounts. New users receive a secure email invitation to create a password. Profile updates use optimistic-concurrency timestamps and write audit records for success, conflict, failure, and reconciliation cases.

Role boundaries are enforced in the Edge Functions and PostgreSQL RPCs:

- a main admin can create and manage `user` and `secondary_admin` accounts;
- an owner can manage every role;
- users cannot change their own role or active status;
- non-owners cannot read or mutate an owner account;
- archiving immediately deactivates and bans the Auth account;
- main admins can permanently purge archived lower-role accounts;
- owner accounts remain hidden and unreachable to non-owners.

The current user's account is placed first in the management list and identified with a dedicated tag.

### 🔒 Authentication and Authorization

The application uses Supabase Auth and an application profile stored in `user_profile`.

Supported authentication flows include:

- email and password sign-in;
- password recovery through secure email links;
- recovery-session password updates;
- email confirmation links;
- route guards that prioritize recovery flows over normal authenticated redirects.

Supported roles:

- `user`;
- `secondary_admin`;
- `main_admin`;
- `owner`.

Protected and permission-aware routes separate general application access from administrative capabilities. Inactive profiles are not treated as authorized users.

Current permissions:

| Capability                                | Minimum role      |
| ----------------------------------------- | ----------------- |
| View the application                      | Active user       |
| Create or edit technicians                | `secondary_admin` |
| Archive or restore technicians            | `main_admin`      |
| Create, edit, archive, or restore services | `main_admin`      |
| Create, edit, archive, or restore users   | `main_admin`      |
| Permanently purge archived entities       | `main_admin`      |

Frontend permission checks control navigation and route access. Supabase Row Level Security, column grants, constraints, and permission-aware RPCs form the database security boundary.

## 🔀 Matching Rules

The matching engine is implemented as pure TypeScript logic and follows these rules:

- A service-zone filter works independently of appliance selection.
- Without selected units, active technicians in the selected zone are returned.
- With multiple selected units, a technician must support every selected unit.
- Gas work requires the technician gas capability.
- Stacked washer and dryer requests require their corresponding stacked capabilities.
- Built-in appliances require both a compatible skill and the built-in capability.
- Commercial requests require commercial technician capability and commercial skill rows.
- Brand requirements are ignored for commercial work.
- Brand support is inherited through brand groups.
- Technician-specific ignored brands override brand-group support.
- Specific issues are matched independently of brands and belong to their corresponding unit.
- Technician ignore rules can exclude units, brands, or specific issues.
- Archived and inactive technicians are excluded from matching results.

## URL-Driven State

The matching form uses React Router search parameters as its source of truth.

Example:

```txt
/?units=washer,dryer&brands=lg,samsung&gas=1&stacked=1
```

This makes filter state:

- shareable;
- restorable after reload;
- compatible with browser navigation;
- independent from transient component state.

URL parameters use readable slugs. Database comparisons use UUIDs after entity data is resolved.

Technician, user, and service-management lists also store the selected section, search query, and status filter in the URL where applicable, so list context survives navigation and can be shared or restored.

## 🛠️ Tech Stack

### Application

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS
- Material UI
- Motion

### Backend

- Supabase Auth
- Supabase JavaScript client and CLI
- PostgreSQL
- Row Level Security
- transactional PostgreSQL RPCs
- Supabase-generated TypeScript types

### Quality and Tooling

- Vitest
- Testing Library
- Playwright
- ESLint
- TypeScript project builds
- Rollup visualizer
- local Supabase and Docker integration checks
- GitHub Actions quality gate and end-to-end smoke pipeline

### Architecture

The project uses a feature/entity-oriented frontend structure:

```txt
src/
  app/
    providers/

  entities/
    brand/
    brandGroup/
    service-zone/
    specific-issue/
    technician/
    technician-ignore-list/
    technician-service-zone/
    technician-skill-set/
    unit/
    user/

  features/
    auth/
    services-management/
      archive-service-entity/
      manage-brands/
      manage-service-zones/
      manage-specific-issues/
      manage-units/
    technician-filter/
    technician-management/
      archive-technician/
      ignore-list/
      new-technician/
      profile-and-capabilities/
      service-zones/
      skills/
    technician-sort/
    theme/
    user-management/

  layouts/
  pages/
    manageTechnicians/
    manageServices/
    manageUsers/

  shared/
    api/
    assets/
    styles/
    ui/

supabase/
  functions/
  migrations/
  templates/
  tests/
```

### 📐 Architecture Principles

- Entity API files own direct Supabase table and entity operations.
- Entity query hooks own reusable server-state reads.
- Feature model files own user workflows, mutations, validation, and business rules.
- Pages compose features and handle route-level loading, error, and not-found states.
- Pure helpers contain filtering, sorting, patch-building, template, and validation logic.
- TanStack Query owns server state; React state owns drafts and transient UI state.
- URL search parameters own shareable filtering and search state.
- Database row types are generated from the Supabase schema.
- Multi-table creation and relationship updates use transactional RPCs.
- Permission checks are repeated at the database boundary.
- Tests are colocated with the logic or component they verify.

## Main Database Tables

- `technician`
- `unit`
- `brand`
- `brand_group`
- `specific_issue`
- `service_zone`
- `technician_skill_set`
- `technician_ignore_list`
- `technician_service_zone`
- `user_profile`
- `user_management_audit`

Relationship tables use database IDs internally. For example, `technician_service_zone` has a composite primary key on `(technician_id, zone_id)` and foreign keys with cascading deletes.

Technician creation and relationship editing use database functions to keep multi-step writes atomic. Archive-aware entities store when and by whom they were archived together with the active state that should be restored. Database constraints prevent an archived user profile from remaining active, while RLS and `current_app_role()` fail closed for inactive or archived accounts.

All public tables have Row Level Security enabled. Lifecycle metadata is controlled through permission-aware RPCs rather than direct client writes. Destructive purge operations require an archived target and the `main_admin` role. User purge additionally enforces role hierarchy so customer administrators cannot purge peers, themselves, or hidden owner accounts.

## Routes

| Route                             | Purpose                            |
| --------------------------------- | ---------------------------------- |
| `/login`                          | Authentication                     |
| `/forgot-password`                | Request a password recovery email  |
| `/secure-email-link`              | Verify Supabase email-link tokens  |
| `/update-password`                | Update a password in recovery mode |
| `/email-confirmation`             | Display email confirmation status  |
| `/`                               | Technician matching workspace      |
| `/technicians`                    | Technician management              |
| `/technicians/new`                | Create a technician                |
| `/technicians/:technicianId/edit` | Technician editor                  |
| `/services`                       | Service management                 |
| `/services/units/new`             | Create a unit                      |
| `/services/units/:unitId/edit`    | Unit editor                        |
| `/services/brands/new`            | Create a brand                     |
| `/services/brands/:brandId/edit`  | Brand editor                       |
| `/services/brand-groups/new`      | Create a brand group               |
| `/services/brand-groups/:brandGroupId/edit` | Brand-group editor        |
| `/services/specific-issues/new`   | Create a specific issue            |
| `/services/specific-issues/:specificIssueId/edit` | Specific-issue editor |
| `/services/zones/new`             | Create a service zone              |
| `/services/zones/:zoneId/edit`    | Service-zone editor                |
| `/users`                          | User management                    |
| `/users/new`                      | Invite a new user                  |
| `/users/:userId/edit`             | User editor                        |

The service and user management pages are protected by role-aware routes and database permissions.

## Testing

The current test suite covers:

- technician matching rules;
- brand groups and ignore-list behavior;
- built-in, stacked, specific-issue, and commercial matching;
- technician sorting and sort-parameter parsing;
- punctuation-tolerant technician and skill search;
- auth errors, profile loading decisions, recovery routes, and permissions;
- user visibility, role hierarchy, dirty-state helpers, validation, and forms;
- technician service-zone mapping and patch generation;
- profile form state, patch generation, and validation;
- skill templates and duplicate prevention;
- unit, brand, brand-group, specific-issue, and service-zone search and validation;
- management cards, archived-entity dialogs, and purge confirmations;
- root-level runtime recovery and application/MUI theme synchronization;
- PostgreSQL archive, restore, purge, cascade, RLS, and owner-isolation integration paths.

GitHub Actions runs two automated CI jobs:

- `quality-gate`: lint, unit/component tests, production build, database lint, and SQL integration tests;
- `e2e-smoke`: a focused Playwright lifecycle check against a local Supabase instance.

Run all tests once:

```bash
npm run test:run
```

Run Vitest in watch mode:

```bash
npm test
```

Run the focused Playwright smoke test against local Supabase:

```bash
npm run test:e2e:smoke
```

Validate the local database schema:

```bash
npx supabase db lint
```

Transactional SQL integration tests live in `supabase/tests`. They insert isolated fixtures, exercise requests as real `authenticated` roles, and roll back their data after each run. On PowerShell, run the complete set against the local Supabase database with:

```powershell
Get-ChildItem .\supabase\tests\*_integration_test.sql | Sort-Object Name | ForEach-Object {
  Get-Content -Raw $_.FullName |
    docker exec -i supabase_db_tech-find psql -v ON_ERROR_STOP=1 -U postgres -d postgres
}
```

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Supabase

Create `.env.local` in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

The application expects a compatible Supabase schema, generated database types, authentication configuration, email templates, and the required RLS policies and RPCs.

For local Supabase development:

```bash
npx supabase start
npx supabase migration up --local
```

Do not expose a service-role or secret key through a `VITE_` environment variable. Browser code uses only the publishable key; privileged user-management operations remain inside Supabase Edge Functions.

### 3. Start the development server

```bash
npm run dev
```

## Database Change and Deployment Workflow

Schema changes must be introduced through a new migration rather than manual Dashboard edits. Use this order:

1. Create and apply the migration locally.
2. Run database lint and the relevant SQL integration tests.
3. Regenerate `database.types.ts` when tables, columns, enums, or RPC signatures change.
4. Deploy migrations before any frontend that reads the new schema.
5. Deploy changed Edge Functions.
6. Build and deploy the frontend last.

Typical commands:

```bash
npx supabase migration up --local
npx supabase db lint
npx supabase gen types typescript --local > src/shared/api/supabase/database.types.ts

npx supabase db push
npx supabase functions deploy create-user
npx supabase functions deploy update-user

npm run build
```

Deploying the database first is required because generated TypeScript types provide compile-time safety only; they cannot make a missing production column or RPC available at runtime.

## Available Scripts

| Command                  | Purpose                                                   |
| ------------------------ | --------------------------------------------------------- |
| `npm run dev`            | Start the Vite development server                         |
| `npm run build`          | Run TypeScript build checks and create a production build |
| `npm run build:analyze`  | Build and generate a bundle visualization                 |
| `npm run lint`           | Run ESLint across the project                             |
| `npm test`               | Run Vitest in watch mode                                  |
| `npm run test:run`       | Run the test suite once                                   |
| `npm run test:e2e:smoke` | Run the focused Playwright lifecycle smoke test           |
| `npm run preview`        | Preview the production build                              |

## Current Status

Implemented:

- Supabase data access, migrations, generated database types, and local integration verification;
- authentication, session handling, active-profile validation, password recovery, and email confirmation;
- role-based frontend permissions, database authorization, and protected routes;
- URL-driven technician matching filters and management search;
- service-zone, unit, brand, issue, and job-option filtering;
- technician skill and ignore-list matching;
- sorting and desktop drag-and-drop custom ordering;
- light and dark themes;
- animated technician and management lists;
- technician creation with profile, zones, skills, templates, and optional ignore rules;
- profile, capability, service-zone, skill, and ignore-list editing;
- technician archive, restore, and restricted permanent purge;
- user invitation, editing, deactivation, archive, restore, audit, and role-aware purge;
- unit, brand-group, brand, specific-issue, and service-zone management;
- reversible service archive workflows and restricted purge;
- owner-profile isolation and archived-user access hardening at the database boundary;
- unsaved-change protection for management forms and technician edit sections;
- root-level recovery UI for lazy-chunk and unexpected React render failures;
- route-level lazy loading with MUI scoped to the authenticated application shell;
- an automated GitHub Actions quality gate and Playwright lifecycle smoke test;
- transactional RPCs for multi-step technician writes;
- unit, component, and SQL integration tests for core business rules and destructive workflows.

Next improvements:

- reconciliation monitoring for user-management operations that leave Auth and profile data out of sync;
- minimal production error monitoring and operational alerts;
- automated off-site database backups and regular restore drills;
- technician-result image export;
- accessibility and responsive UI polish;
- a CI bundle-size budget to prevent startup JavaScript regressions.
