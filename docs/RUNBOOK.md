# TechFind Runbook

This document is the operational handoff guide for customer managers and administrators. It does not transfer ownership of the TechFind software or source code.

## Service ownership

- TechFind and its source code remain the Provider's intellectual property.
- The Customer receives a subscription right to use the hosted service for internal business operations.
- Business data entered by the Customer remains Customer Data.
- The Provider operates deployment, database migrations, backups, and technical recovery.

## Roles

| Role              | Intended use                                                                         |
| ----------------- | ------------------------------------------------------------------------------------ |
| `user`            | Daily technician search and dispatch workflow                                        |
| `secondary_admin` | Daily technician maintenance without destructive archive/purge authority             |
| `main_admin`      | Customer administrator for users, services, archives, restores, and controlled purge |
| `owner`           | Provider recovery account; not used for daily customer operations                    |

The Customer should maintain at least two active `main_admin` accounts. The Provider's owner account must not be shared.

## User onboarding

1. A `main_admin` opens User Management.
2. The administrator enters the employee's work email, name, alias, and minimum required role.
3. TechFind sends a secure invitation.
4. The employee creates a password containing at least 12 characters, lowercase, uppercase, and a number.
5. The administrator verifies the employee can access only the intended management sections.

Public self-registration is not part of the onboarding process.

## User offboarding

1. Deactivate the account immediately when temporary access should stop.
2. Archive the account when the employee leaves or the record should leave normal management lists.
3. Confirm the user can no longer sign in.
4. Preserve the archived record while business or audit history may still be needed.
5. Use permanent purge only after confirming that retention is no longer required.

Archive is reversible. Purge is permanent and should be treated as an exceptional administrative operation.

## Daily operating rules

- Use real service data, not shared notes or passwords, in TechFind fields.
- Do not share accounts.
- Use the least privileged role required for each employee.
- Review inactive and archived users monthly.
- Review service and technician changes before saving.
- Do not purge records during training or demonstrations.

## Support

Standard support hours are Monday through Friday, 9:00 AM–5:00 PM Eastern Time, excluding Provider-observed holidays.

Replace these placeholders before handoff:

```text
Support email: [SUPPORT EMAIL]
Urgent contact: [URGENT CONTACT METHOD]
Billing contact: [BILLING EMAIL]
```

| Severity | Example                                                              | Initial response target |
| -------- | -------------------------------------------------------------------- | ----------------------- |
| Critical | Application unavailable, suspected data loss, or unauthorized access | 4 business hours        |
| High     | Core matching or admin workflow unusable for multiple users          | 1 business day          |
| Normal   | Single-user issue, question, cosmetic defect, or feature request     | 2 business days         |

Response targets are measured during support hours and are not guaranteed resolution times.

## Incident reporting

When reporting an issue, include:

- time and time zone;
- affected user or role, without sending a password;
- page and action being performed;
- screenshot with sensitive information removed;
- whether the issue affects one or all users;
- browser and device.

Never send JWTs, authorization headers, database passwords, recovery links, or Supabase secret keys.

## Backup and recovery policy

The operating target is:

- encrypted logical database backup every 24 hours;
- 7 daily, 4 weekly, and 12 monthly retained copies;
- off-site storage separate from Supabase and the development computer;
- monthly restore verification;
- recovery point target of 24 hours;
- commercially reasonable recovery-time target of 2 business days.

Recovery timing depends on incident scope and third-party availability. Full technical instructions are in [OPERATIONS_GUIDE.md](OPERATIONS_GUIDE.md).

## Releases and maintenance

1. Changes are developed outside `main`.
2. A pull request must pass lint, tests, build, database lint, SQL integration tests, and Playwright smoke.
3. Database migrations deploy before frontend code that depends on them.
4. Changed Edge Functions deploy before the frontend begins using them.
5. Production is smoke-tested after deployment.
6. Material planned maintenance is communicated in advance when practical.

## Subscription termination and data export

Either party may terminate with 30 days' written notice, subject to the signed agreement.

If requested before termination or within 10 business days afterward, the Provider supplies:

- CSV exports of primary business tables;
- JSON exports for structured relationships where CSV would lose meaning;
- one PostgreSQL logical dump for technical migration;
- a short data dictionary identifying tables and relationships.

The export should be delivered through an encrypted transfer channel. Production Customer Data is deleted within 30 days after the export window, while encrypted backup copies expire through normal retention within 90 days unless law requires longer retention.

## Pilot rollout checklist

- [ ] Customer has named one operational contact and one billing contact.
- [ ] At least two customer `main_admin` accounts exist.
- [ ] Provider owner credentials are private and recovery access is verified.
- [ ] SMTP invitation and password recovery are tested.
- [ ] A fresh encrypted off-site backup exists.
- [ ] A restore drill has succeeded.
- [ ] Reconciliation alerting is active.
- [ ] Security corrective migration is deployed.
- [ ] Customer administrators understand archive versus purge.
- [ ] Support and incident contacts are filled in above.
- [ ] Subscription agreement is signed.
- [ ] Pilot starts with 2–5 users before the complete team is onboarded.
