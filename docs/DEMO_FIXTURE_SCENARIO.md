# TechFind Demo Fixture Scenario

This document defines the fictional, deterministic demo dataset for local TechFind development.
It is the contract for `supabase/seed.sql` and the separate local Auth setup. It must never be
used against hosted Supabase and must not contain real customer, employer, or personal data.

## Purpose

The fixture should make the application understandable immediately after a clean local reset.
It demonstrates the matching rules and management states with a small, readable dataset rather
than simulating production scale.

E2E fixtures remain separate. Playwright setup may create disposable records and users, but it
must not depend on these demo records or delete them.

## Domain data

### Service zones

- North
- South
- Central

### Units

Active units:

- Washer — supports stacking and commercial work.
- Dryer — supports stacking, gas, and commercial work.
- Refrigerator — supports commercial work.
- Stove — supports gas and commercial work.
- Wall Oven — built-in unit and supports commercial work.

Management-only inactive unit:

- Legacy Dishwasher — inactive and excluded from normal matching.

The fixture must use the unit capabilities already represented by the database schema. A unit
capability does not, by itself, qualify a technician; the technician capability and skill rows
must also match.

### Brand groups and brands

| Brand group | Brands                 |
| ----------- | ---------------------- |
| Standard    | Whirlpool, Samsung, LG |
| Premium     | Bosch                  |

Brand slugs must be stable and lowercase.

### Specific issues

| Display name                       | Slug                                 | Related unit |
| ---------------------------------- | ------------------------------------ | ------------ |
| Compressor Replacement             | `compressor-replacement`             | Refrigerator |
| Dryer Taking Several Cycles to Dry | `dryer-taking-several-cycles-to-dry` | Dryer        |

An issue skill must reference the issue's related unit. An issue for one unit must never satisfy a
skill requirement for another unit.

## Technicians

The six active technicians below demonstrate matching behavior. A seventh management-only record
demonstrates archive state.

| Technician    | Demonstrated behavior                                                      |
| ------------- | -------------------------------------------------------------------------- |
| Alex Demo     | Washer and Dryer skills, North zone, stacked Washer and Dryer capabilities |
| Morgan Demo   | Has a qualifying skill but ignores the LG brand                            |
| Casey Demo    | Refrigerator plus Compressor Replacement issue                             |
| Riley Demo    | Wall Oven skill plus built-in capability                                   |
| Jordan Demo   | Commercial Dryer work and Dryer Taking Several Cycles to Dry issue         |
| Taylor Demo   | Gas Stove work without built-in or stacked capabilities                    |
| Archived Demo | Management-only archived technician, excluded from normal matching         |

The exact zone assignments and skills must be chosen so that the test cases below
produce deterministic results.

## Skill and ignore-list rules

The `technician_skill_set` constraint allows exactly one variant per row:

- commercial skill: `commercial = true`, `brand_group_id = null`, `specific_issue_id = null`;
- brand-group skill: `commercial = false`, `brand_group_id` set, `specific_issue_id = null`;
- specific-issue skill: `commercial = false`, `brand_group_id = null`, `specific_issue_id` set.

Jordan therefore needs two Dryer-related rows:

1. a commercial base Dryer skill;
2. a specific-issue skill for `dryer-taking-several-cycles-to-dry`.

Morgan's LG ignore rule must set `brand_id` to LG and leave `unit_id` and `specific_issue_id`
null. This makes the brand restriction apply whenever LG is selected.

Alex needs separate base skills for Washer and Dryer. The stacked filter additionally requires
the corresponding technician boolean capabilities:

- `can_service_stacked_washer = true`;
- `can_service_stacked_dryer = true`.

Riley needs both a Wall Oven skill and `can_service_built_in = true`. Taylor needs a Stove skill
and `gas = true`; he must not receive stacked or built-in capabilities.

## Expected matching stories

These are acceptance scenarios for the eventual fixture. The seed is not complete until each
story is explainable from the inserted rows.

1. **North + Washer + Dryer + Stacked**
   - Alex Demo is included.
   - A technician missing either stacked capability or either unit skill is excluded.

2. **Washer + LG**
   - A technician with a qualifying Standard brand-group skill can match.
   - Morgan Demo is excluded specifically because the selected brand is on Morgan's ignore list.

3. **Refrigerator + Compressor Replacement**
   - Casey Demo is included.
   - A technician with only a base Refrigerator skill is excluded because the issue skill is
     missing.

4. **Dryer + Commercial + Dryer Taking Several Cycles to Dry**
   - Jordan Demo is included only when both the commercial base skill and specific-issue skill
     are present.
   - Brand-group matching must not be required for the commercial path.

5. **Wall Oven**
   - Riley Demo is included.
   - A technician with the Wall Oven skill but without built-in capability is excluded.

6. **Stove + Gas**
   - Taylor Demo is included.
   - A technician without `gas = true` is excluded even if the Stove skill exists.

7. **Selected service zone**
   - A technician assigned to the selected zone can match.
   - A technician assigned only to another zone is excluded.

8. **No units selected**
   - The result is filtered by selected service zone only.
   - Unit skills and unit-specific ignore rules are not evaluated because no unit is selected.

## Management-state fixtures

The dataset must contain visible examples for management pages:

- active records;
- inactive records, including Legacy Dishwasher;
- one archived technician, Archived Demo;
- relationships that remain valid when archived records are displayed or hidden according to
  the existing application rules.

The archived technician must not be used in matching and isn't visible in the result. Archive metadata must use
the existing schema fields and must not invent a production user ID.

## Local Auth users

Auth users are not created by `seed.sql`. A separate local-only setup script must create:

- one `main_admin`;
- one `secondary_admin`;
- one normal `user`.

Passwords must come from documented local environment variables or safe local defaults used only
for development. No service-role key or password may be committed to SQL, source code, or this
document.

The local Auth setup must be separate from the disposable E2E setup so running Playwright cleanup
cannot remove the demo users or demo data.

## Deterministic identifiers

Use explicit UUIDs from a fixture-only range, for example:

```text
10000000-0000-4000-8000-000000000001
10000000-0000-4000-8000-000000000002
...
```

Do not reuse IDs from SQL integration tests or E2E fixtures. Every foreign-key relationship must
be readable from the seed and repeatable after `npx supabase db reset`.

## Deterministic fixture ID map

### Service zones

| Constant     | UUID                                   | Name    |
| ------------ | -------------------------------------- | ------- |
| ZONE_NORTH   | `10000000-0000-4000-8000-000000000001` | North   |
| ZONE_SOUTH   | `10000000-0000-4000-8000-000000000002` | South   |
| ZONE_CENTRAL | `10000000-0000-4000-8000-000000000003` | Central |

### Units

| Constant               | UUID                                   | Name              |
| ---------------------- | -------------------------------------- | ----------------- |
| UNIT_WASHER            | `11000000-0000-4000-8000-000000000001` | Washer            |
| UNIT_DRYER             | `11000000-0000-4000-8000-000000000002` | Dryer             |
| UNIT_REFRIGERATOR      | `11000000-0000-4000-8000-000000000003` | Refrigerator      |
| UNIT_STOVE             | `11000000-0000-4000-8000-000000000004` | Stove             |
| UNIT_WALL_OVEN         | `11000000-0000-4000-8000-000000000005` | Wall Oven         |
| UNIT_LEGACY_DISHWASHER | `11000000-0000-4000-8000-000000000006` | Legacy Dishwasher |

### Brand groups

| Constant             | UUID                                   | Name     |
| -------------------- | -------------------------------------- | -------- |
| BRAND_GROUP_STANDARD | `12000000-0000-4000-8000-000000000001` | Standard |
| BRAND_GROUP_PREMIUM  | `12000000-0000-4000-8000-000000000002` | Premium  |

### Brands

| Constant        | UUID                                   | Name      | Group    |
| --------------- | -------------------------------------- | --------- | -------- |
| BRAND_WHIRLPOOL | `13000000-0000-4000-8000-000000000001` | Whirlpool | Standard |
| BRAND_BOSCH     | `13000000-0000-4000-8000-000000000002` | Bosch     | Premium  |
| BRAND_SAMSUNG   | `13000000-0000-4000-8000-000000000003` | Samsung   | Standard |
| BRAND_LG        | `13000000-0000-4000-8000-000000000004` | LG        | Standard |

### Specific issues

| Constant                     | UUID                                   | Name                               | Unit         |
| ---------------------------- | -------------------------------------- | ---------------------------------- | ------------ |
| ISSUE_COMPRESSOR_REPLACEMENT | `14000000-0000-4000-8000-000000000001` | Compressor Replacement             | Refrigerator |
| ISSUE_DRYER_CYCLES           | `14000000-0000-4000-8000-000000000002` | Dryer Taking Several Cycles to Dry | Dryer        |

### Technicians

| Constant      | UUID                                   | Name          |
| ------------- | -------------------------------------- | ------------- |
| TECH_ALEX     | `15000000-0000-4000-8000-000000000001` | Alex Demo     |
| TECH_MORGAN   | `15000000-0000-4000-8000-000000000002` | Morgan Demo   |
| TECH_CASEY    | `15000000-0000-4000-8000-000000000003` | Casey Demo    |
| TECH_RILEY    | `15000000-0000-4000-8000-000000000004` | Riley Demo    |
| TECH_JORDAN   | `15000000-0000-4000-8000-000000000005` | Jordan Demo   |
| TECH_TAYLOR   | `15000000-0000-4000-8000-000000000006` | Taylor Demo   |
| TECH_ARCHIVED | `15000000-0000-4000-8000-000000000007` | Archived Demo |

## Fixture relationships

### Technician-to-zone assignments

| Technician    | Zones   |
| ------------- | ------- |
| Alex Demo     | North   |
| Morgan Demo   | North   |
| Casey Demo    | South   |
| Riley Demo    | Central |
| Jordan Demo   | South   |
| Taylor Demo   | Central |
| Archived Demo | South   |

### Technician skills

| Technician  | Unit         | Variant        | Brand group / issue                |
| ----------- | ------------ | -------------- | ---------------------------------- |
| Alex Demo   | Washer       | brand group    | Standard                           |
| Alex Demo   | Dryer        | brand group    | Standard                           |
| Morgan Demo | Washer       | brand group    | Standard                           |
| Casey Demo  | Refrigerator | brand group    | Standard                           |
| Casey Demo  | Refrigerator | specific issue | Compressor Replacement             |
| Riley Demo  | Wall Oven    | brand group    | Premium                            |
| Jordan Demo | Dryer        | commercial     | —                                  |
| Jordan Demo | Dryer        | specific issue | Dryer Taking Several Cycles to Dry |
| Taylor Demo | Stove        | brand group    | Standard                           |

### Technician capabilities

| Technician    |   Gas | Built-in | Stacked Washer | Stacked Dryer | Commercial |
| ------------- | ----: | -------: | -------------: | ------------: | ---------: |
| Alex Demo     | false |    false |           true |          true |      false |
| Morgan Demo   | false |    false |          false |         false |      false |
| Casey Demo    | false |    false |          false |         false |      false |
| Riley Demo    | false |     true |          false |         false |      false |
| Jordan Demo   | false |    false |          false |          true |       true |
| Taylor Demo   |  true |    false |          false |         false |      false |
| Archived Demo | false |    false |          false |         false |      false |

### Technician ignore rules

| Technician  | Ignored brand | Unit | Issue |
| ----------- | ------------- | ---- | ----- |
| Morgan Demo | LG            | any  | any   |

## Insertion order for the future seed

The eventual `supabase/seed.sql` must insert records in this dependency order:

1. service zones;
2. units;
3. brand groups;
4. brands;
5. specific issues;
6. technicians;
7. technician service zones;
8. technician skills;
9. technician ignore-list rules.

The seed must rely on a clean `db reset` for idempotence. Do not add broad `ON CONFLICT DO NOTHING`
clauses to hide fixture errors.

## Out of scope

- Hosted or production data;
- real customer or employee names;
- production Auth users;
- Supabase Storage objects;
- E2E-specific records;
- simulating dozens or hundreds of technicians;
- changing matching logic to fit the fixture.
