import { describe, expect, it } from "vitest";
import type { SpecificIssue } from "../../../../entities/specific-issue/specific-issue.types";
import type { Unit } from "../../../../entities/unit/unit.types";
import { filterSpecificIssues } from "./filterSpecificIssues";

const makeUnit = (overrides: Partial<Unit> = {}): Unit => ({
  active: true,
  active_before_archive: null,
  archived_at: null,
  archived_by: null,
  can_be_commercial: false,
  can_be_gas: false,
  can_be_stacked: false,
  display_order: 10,
  id: "unit-1",
  is_built_in: false,
  name: "Dryer",
  slug: "dryer",
  ...overrides,
});

const makeIssue = (overrides: Partial<SpecificIssue> = {}): SpecificIssue => ({
  active: true,
  active_before_archive: null,
  archived_at: null,
  archived_by: null,
  id: "issue-1",
  name: "No Heat",
  slug: "no-heat",
  unit_id: "unit-1",
  ...overrides,
});

const units = [
  makeUnit(),
  makeUnit({
    active: false,
    id: "unit-2",
    name: "Legacy Washer",
    slug: "legacy-washer",
  }),
];
const unitsById = new Map(units.map((unit) => [unit.id, unit]));
const issues = [
  makeIssue(),
  makeIssue({ id: "issue-2", name: "No Spin", slug: "no-spin", unit_id: "unit-2" }),
  makeIssue({ active: false, id: "issue-3", name: "No Power", slug: "no-power" }),
];

describe("filterSpecificIssues", () => {
  it("uses the issue and parent unit effective status", () => {
    expect(
      filterSpecificIssues({
        searchTerm: "",
        specificIssues: issues,
        status: "inactive",
        unitsById,
      }),
    ).toEqual([issues[1], issues[2]]);
  });

  it("searches by issue and unit identity", () => {
    expect(
      filterSpecificIssues({
        searchTerm: "legacy washer",
        specificIssues: issues,
        status: "all",
        unitsById,
      }),
    ).toEqual([issues[1]]);

    expect(
      filterSpecificIssues({
        searchTerm: "no-heat",
        specificIssues: issues,
        status: "all",
        unitsById,
      }),
    ).toEqual([issues[0]]);
  });
});
