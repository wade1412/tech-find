# 🔍 TechFind

TechFind is a React and TypeScript application that helps appliance-repair dispatchers find technicians who match a service request.

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
- temporary drag-and-drop reordering.

Changing the filters or selected sort resets the custom order to the corresponding sorted result.

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
- only `owner` can permanently purge an already archived technician;
- permanent purge remains an explicit cascade delete in a separate danger zone.

Permissions and lifecycle invariants are enforced in PostgreSQL, not only in the frontend.

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

| Capability                     | Minimum role      |
| ------------------------------ | ----------------- |
| View the application           | Active user       |
| Manage technicians             | `secondary_admin` |
| Archive or restore technicians | `main_admin`      |
| Permanently purge technicians  | `owner`           |
| Manage services                | `main_admin`      |
| Manage users                   | `main_admin`      |
| Use owner tools                | `owner`           |

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

The technician-management page also stores its search query and status filter in the URL, so list context survives navigation to an edit page and back.

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
- ESLint
- TypeScript project builds
- Rollup visualizer
- local Supabase and Docker integration checks
- Git and GitHub

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

  features/
    auth/
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

  layouts/
  pages/
    manageTechnicians/

  shared/
    api/
    assets/
    styles/
    ui/

supabase/
  migrations/
  templates/
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

Relationship tables use database IDs internally. For example, `technician_service_zone` has a composite primary key on `(technician_id, zone_id)` and foreign keys with cascading deletes.

Technician creation and relationship editing use database functions to keep multi-step writes atomic. Technician archive metadata stores when and by whom a technician was archived, together with the active state that should be restored.

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
| `/users`                          | User management                    |
| `/owner`                          | Owner-only tools                   |

The service, user, and owner management pages currently have protected routes, but their full workflows are still under development.

## Testing

The current test suite covers:

- technician matching rules;
- brand groups and ignore-list behavior;
- built-in, stacked, specific-issue, and commercial matching;
- technician sorting and sort-parameter parsing;
- punctuation-tolerant technician and skill search;
- auth errors, profile loading decisions, recovery routes, and permissions;
- technician service-zone mapping and patch generation;
- profile form state, patch generation, and validation;
- skill templates and duplicate prevention;
- archive purge confirmation behavior.

Run all tests once:

```bash
npm run test:run
```

Run Vitest in watch mode:

```bash
npm test
```

Current local result: 17 test files and 142 tests passing.

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

### 3. Start the development server

```bash
npm run dev
```

## Available Scripts

| Command                 | Purpose                                                   |
| ----------------------- | --------------------------------------------------------- |
| `npm run dev`           | Start the Vite development server                         |
| `npm run build`         | Run TypeScript build checks and create a production build |
| `npm run build:analyze` | Build and generate a bundle visualization                 |
| `npm run lint`          | Run ESLint across the project                             |
| `npm test`              | Run Vitest in watch mode                                  |
| `npm run test:run`      | Run the test suite once                                   |
| `npm run preview`       | Preview the production build                              |

## Current Status

Implemented:

- Supabase data access, migrations, generated database types, and local integration verification;
- authentication, session handling, active-profile validation, password recovery, and email confirmation;
- role-based frontend permissions, database authorization, and protected routes;
- URL-driven technician matching filters and management search;
- service-zone, unit, brand, issue, and job-option filtering;
- technician skill and ignore-list matching;
- sorting and drag-and-drop custom ordering;
- light and dark themes;
- animated technician and management lists;
- technician creation with profile, zones, skills, templates, and optional ignore rules;
- profile, capability, service-zone, skill, and ignore-list editing;
- technician archive, restore, and owner-only permanent purge;
- transactional RPCs for multi-step technician writes;
- unit and component tests for core business logic and destructive confirmations.

In progress:

- collapsible technician-matching filters on mobile;
- mobile burger navigation for the authenticated admin header;
- service and user management workflows;
- owner tools;
- accessibility and responsive UI polish;
- broader component and end-to-end test coverage;
- bundle-size and route-level loading optimization.
