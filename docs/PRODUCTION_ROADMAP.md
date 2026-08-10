# TechFind Roadmap

This document provides a high-level view of TechFind's development direction. It focuses on product outcomes and intentionally excludes internal implementation checklists, credentials, deployment procedures, and security-sensitive details.

Roadmap priorities may change as the project evolves. Completed work is documented in the repository history and README.

## Current foundation

TechFind currently includes:

- technician matching by service zone, appliance, brand, issue, and job requirements;
- technician, user, and service-catalog management;
- role-based access backed by Supabase authorization rules;
- reversible archive and restore workflows with restricted permanent deletion;
- URL-driven filters and management searches;
- protection against leaving forms with unsaved changes;
- unit, component, database integration, and browser smoke tests;
- an automated GitHub Actions quality gate.

## In progress

### Production security

- Strengthen privileged-account authentication.
- Continue reviewing authorization at both application and database boundaries.
- Improve production authentication policies and recovery procedures.

### Reliability and diagnostics

- Add a root-level recovery experience for unexpected runtime errors.
- Introduce production error monitoring and actionable operational alerts.
- Continue expanding high-value integration coverage without duplicating unit tests.

## Planned

### Performance

- Analyze the production bundle and reduce unnecessary initial JavaScript.
- Improve loading behavior for larger management datasets where measurements justify it.

### Data resilience

- Establish encrypted off-site database backups.
- Validate backups through scheduled restore drills.
- Document recovery outcomes and retention rules.

### Product capabilities

- Add a deterministic image export for filtered technician results.
- Continue accessibility and responsive-layout improvements.

## Engineering principles

Future work should preserve these project standards:

- authorization is enforced on the backend, not only in the UI;
- schema changes are introduced through reviewed migrations;
- destructive actions are explicit, restricted, and tested;
- automated tests focus on business-critical behavior;
- new abstractions must reduce real duplication or complexity;
- performance changes should be based on measurements.

## Tracking progress

Repository changes and pull requests are the source of truth for completed work. Implementation-sized tasks, technical decisions, and acceptance criteria should be tracked in GitHub Issues or Projects rather than added to this public overview.
