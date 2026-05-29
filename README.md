# 🔍 TechFind

TechFind is a React + TypeScript application for matching appliance repair technicians with customer service requests based on units, brands, specific issues, and technician capabilities.

The project is built as a portfolio and learning project, with a focus on realistic business logic, clean frontend architecture, URL-driven filters, and Supabase-backed data.

## Project Goal

Dispatchers often need to quickly decide which technician can handle a specific appliance repair request.
TechFind helps simplify this process by filtering technicians based on:

- appliance unit
- brand / brand group
- specific issue
- gas capability
- stacked appliance capability
- commercial appliance capability
- technician skill set
- technician ignore rules

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS
- Material UI
- Motion React

### Backend / Database

- Supabase
- PostgreSQL
- Supabase generated TypeScript types

### Tools

- Git / GitHub
- npm
- ESLint
- Chrome DevTools

## Main Features

- URL-driven filter state using React Router search params
- Multi-select unit filtering
- Grouped brand select with Material UI Autocomplete
- Specific issue filtering based on selected units
- Gas / stacked / commercial job options
- Light / dark theme support
- Supabase data fetching with TanStack Query
- Technician filtering based on skill set and capabilities
- Technician cards with expandable details

## Architecture Overview

The project follows a feature/entity-based structure.

```txt
src/
  app/
    providers/

  entities/
    technician/
    unit/
    brand/
    brandGroup/
    specific-issue/
    technician-skill-set/
    technician-ignore-list/

  features/
    technician-filter/
      model/
      ui/

  pages/
  shared/
```

## Architecture Principles

- Supabase API calls are placed inside entity API files.
- TanStack Query hooks stay close to the related entity.
- URL filter state is managed in `features/technician-filter/model/useTechnicianFilters.ts`.
- Technician filtering business logic is kept in pure functions.
- React components are responsible for UI, not complex business rules.
- URL search params store slugs, while database relations use UUIDs internally.
- Filtering logic converts slugs to IDs before comparing database relationships.

## Filtering Logic

The filtering logic is built around the idea that a technician must match all selected request requirements.

Current filtering rules include:

- If no units are selected, all active technicians are shown.
- If multiple units are selected, the technician must support all selected units.
- Gas jobs require `technician.gas = true`.
- Commercial jobs require:
  - `technician.commercial = true`
  - matching commercial skill rows in `technician_skill_set`

- Stacked washer/dryer jobs require the corresponding stacked capability.
- Built-in units require `can_service_built_in = true`.
- Brand filtering is based on brand groups.
- Specific issue filtering is tied to selected units.
- Ignore list logic is used for technician-specific exclusions.

## URL Filter State

Example URL:

```txt
/?units=washer,dryer&brands=lg,samsung&gas=1&stacked=1
```

Search params are used as the source of truth for filters. This makes filter state shareable and restorable after page reload.

## Database Notes

The application uses Supabase tables such as:

- `technician`
- `unit`
- `brand`
- `brand_group`
- `specific_issue`
- `technician_skill_set`
- `technician_ignore_list`

Supabase generated TypeScript types are used to keep frontend data types aligned with the database schema.

## Current Status

The project is actively in development.

Implemented:

- Supabase integration
- TanStack Query setup
- URL-driven filters
- unit selection
- brand selection
- specific issue selection
- job option checkboxes
- dark / light theme
- Technician filtering

In progress:

- Auth
- Priority system
- polishing UI, UX and edge cases

## Learning Focus

This project is built to practice:

- React architecture
- TypeScript data modeling
- server state management
- URL state management
- Supabase integration
- business logic separation
- realistic filtering algorithms
- production-like frontend structure
