# 🔍 TechFind

TechFind is a React and TypeScript application that helps appliance-repair dispatchers find technicians who match a service request.

Matching is based on appliance units, service zones, brands, specific issues, job requirements, technician skills, capabilities, and technician-specific ignore rules. The project is built as a portfolio and learning application around realistic business rules, frontend architecture, authentication, and Supabase-backed data.

## 🔁 Core Workflows

### 👷 Technician Matching

Dispatchers can build a service request using:

- one or more appliance units;
- a service zone;
- brands and brand groups;
- unit-specific issues;
- gas, stacked, built-in, and commercial requirements.

The application filters active technicians and shows the technicians who satisfy the complete request.

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
- open a dedicated technician edit page;
- update profile information and daily job capacity;
- enable or disable technician capabilities;
- activate or deactivate a technician;
- update technician service zones.

Profile updates use normalized form state, client-side validation, minimal database patches, Supabase mutations, and TanStack Query invalidation.

### 🔒 Authentication and Authorization

The application uses Supabase Auth and an application profile stored in `user_profile`.

Supported roles:

- `user`;
- `secondary_admin`;
- `main_admin`;
- `owner`.

Protected and permission-aware routes separate general application access from administrative capabilities. Inactive profiles are not treated as authorized users.

Current permissions:

| Capability           | Minimum role      |
| -------------------- | ----------------- |
| View the application | Active user       |
| Manage technicians   | `secondary_admin` |
| Manage services      | `main_admin`      |
| Manage users         | `main_admin`      |
| Use owner tools      | `owner`           |

Frontend permission checks control navigation and route access. Supabase Row Level Security is the database security boundary for privileged writes.

## 🔀 Matching Rules

The matching engine is implemented as pure TypeScript logic and follows these rules:

- A service-zone filter works independently of appliance selection.
- Without selected units, active technicians in the selected zone are returned.
- With multiple selected units, a technician must support every selected unit.
- Gas work requires the technician gas capability.
- Stacked washer and dryer requests require their corresponding stacked capabilities.
- Built-in appliances require the built-in capability.
- Commercial requests require commercial technician capability and commercial skill rows.
- Brand requirements are ignored for commercial work.
- Brand support is inherited through brand groups.
- Technician-specific ignored brands override brand-group support.
- Specific issues are matched independently of brands and belong to their corresponding unit.
- Technician ignore rules can exclude units, brands, or specific issues.

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
- Supabase JavaScript client
- PostgreSQL
- Row Level Security
- Supabase-generated TypeScript types

### Quality and Tooling

- Vitest
- Testing Library
- ESLint
- TypeScript project builds
- Rollup visualizer
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
      profile-and-capabilities/
      service-zones/
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
```

### 📐 Architecture Principles

- Entity API files own direct Supabase table operations.
- Entity query hooks own reusable server-state reads.
- Feature model files own user workflows, mutations, validation, and business rules.
- Pages compose features and handle route-level loading, error, and not-found states.
- Pure helpers contain filtering, sorting, patch-building, and validation logic.
- TanStack Query owns server state; React state owns drafts and transient UI state.
- URL search parameters own technician-matching filters.
- Database row types are generated from the Supabase schema.
- Tests are colocated with the logic they verify.

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

## Routes

| Route                             | Purpose                       |
| --------------------------------- | ----------------------------- |
| `/login`                          | Authentication                |
| `/`                               | Technician matching workspace |
| `/technicians`                    | Technician management         |
| `/technicians/:technicianId/edit` | Technician editor             |
| `/services`                       | Service management            |
| `/users`                          | User management               |
| `/owner`                          | Owner-only tools              |

The service, user, and owner management pages currently have protected routes but their full workflows are still under development.

## Testing

The current test suite covers:

- technician matching rules;
- brand groups and ignore-list behavior;
- specific issues and commercial matching;
- technician sorting and sort-parameter parsing;
- technician search;
- auth errors, profile loading decisions, and permissions;
- technician service-zone mapping;
- profile form state, patch generation, and validation;
- service-zone patch generation.

Run all tests once:

```bash
npm run test:run
```

Run Vitest in watch mode:

```bash
npm test
```

Current local result: 11 test files and 85 tests passing.

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

The application expects a compatible Supabase schema, generated database types, authentication configuration, and the required RLS policies.

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

- Supabase data access and generated database types;
- authentication, session handling, and active-profile validation;
- role-based frontend permissions and protected routes;
- URL-driven technician filters;
- service-zone, unit, brand, issue, and job-option filtering;
- technician skill and ignore-list matching;
- sorting and drag-and-drop custom ordering;
- light and dark themes;
- animated technician and management lists;
- technician management search;
- profile and capability editing;
- service-zone editing pipeline;
- unit tests for core business logic.

In progress:

- final service-zone write-policy and integration verification;
- technician skill-set editing;
- technician ignore-list editing;
- service and user management workflows;
- owner tools;
- atomic database updates for multi-step relationship changes;
- accessibility and UI polish;
- broader component and integration test coverage.
