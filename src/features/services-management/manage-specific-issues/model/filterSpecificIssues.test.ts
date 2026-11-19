import { describe, expect, it } from "vitest";
import { filterSpecificIssues } from "./filterSpecificIssues";
import { makeIssue } from "../../../../entities/specific-issue/testing/specific-issue.factory";
import { makeUnit } from "../../../../entities/unit/testing/unit.factory";

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
  makeIssue({
    id: "issue-2",
    name: "No Spin",
    slug: "no-spin",
    unit_id: "unit-2",
  }),
  makeIssue({
    active: false,
    id: "issue-3",
    name: "No Power",
    slug: "no-power",
  }),
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
