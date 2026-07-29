import { describe, expect, it } from "vitest";
import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";
import type { SpecificIssue } from "../../../../entities/specific-issue/specific-issue.types";
import type { Unit } from "../../../../entities/unit/unit.types";
import { filterSkillsBySearch } from "./skills.helpers";
import type { SkillDraft } from "./skills.types";

const unitsById = new Map<string, Unit>([
  [
    "washer",
    {
      active_before_archive: null,
      archived_at: null,
      archived_by: null,
      id: "washer",
      name: "Washer",
      slug: "washer",
      active: true,
      display_order: 1,
      is_built_in: false,
      can_be_stacked: true,
      can_be_gas: false,
      can_be_commercial: true,
    },
  ],
  [
    "dryer",
    {
      active_before_archive: null,
      archived_at: null,
      archived_by: null,
      id: "dryer",
      name: "Dryer",
      slug: "dryer",
      active: true,
      display_order: 2,
      is_built_in: false,
      can_be_stacked: true,
      can_be_gas: true,
      can_be_commercial: true,
    },
  ],
  [
    "oven",
    {
      active_before_archive: null,
      archived_at: null,
      archived_by: null,
      id: "oven",
      name: "Wall Oven",
      slug: "wall-oven",
      active: true,
      display_order: 3,
      is_built_in: true,
      can_be_stacked: false,
      can_be_gas: true,
      can_be_commercial: true,
    },
  ],
]);

const brandGroupsById = new Map<string, BrandGroup>([
  [
    "standard",
    {
      id: "standard",
      name: "Standard",
      slug: "standard",
      active: true,
      display_order: 1,
      active_before_archive: null,
      archived_at: null,
      archived_by: null,
    },
  ],
  [
    "high-end",
    {
      id: "high-end",
      name: "High End",
      slug: "high-end",
      active: true,
      display_order: 2,
      active_before_archive: null,
      archived_at: null,
      archived_by: null,
    },
  ],
]);

const specificIssuesById = new Map<string, SpecificIssue>([
  [
    "no-heat",
    {
      id: "no-heat",
      name: "No Heat",
      slug: "no-heat",
      unit_id: "oven",
      active: true,
    },
  ],
]);

const skills: SkillDraft[] = [
  {
    key: "washer-standard",
    sourceId: null,
    unitId: "washer",
    kind: "brandGroup",
    brandGroupId: "standard",
  },
  {
    key: "washer-high-end",
    sourceId: null,
    unitId: "washer",
    kind: "brandGroup",
    brandGroupId: "high-end",
  },
  {
    key: "dryer-commercial",
    sourceId: null,
    unitId: "dryer",
    kind: "commercial",
  },
  {
    key: "oven-no-heat",
    sourceId: null,
    unitId: "oven",
    kind: "specificIssue",
    specificIssueId: "no-heat",
  },
];

const filter = (searchTerm: string) =>
  filterSkillsBySearch(
    skills,
    searchTerm,
    unitsById,
    brandGroupsById,
    specificIssuesById,
  );

const getKeys = (filteredSkills: SkillDraft[]) =>
  filteredSkills.map((skill) => skill.key);

describe("filterSkillsBySearch", () => {
  it("returns the original skills for an empty query", () => {
    expect(filter("")).toBe(skills);
    expect(filter("     ")).toBe(skills);
  });

  it("matches without case sensitivity", () => {
    expect(getKeys(filter("wAsHeR"))).toEqual([
      "washer-standard",
      "washer-high-end",
    ]);
  });

  it("matches a unit name", () => {
    expect(getKeys(filter("wall oven"))).toEqual(["oven-no-heat"]);
  });

  it("matches a Commercial skill label", () => {
    expect(getKeys(filter("commercial"))).toEqual(["dryer-commercial"]);
  });

  it("matches a brand group name", () => {
    expect(getKeys(filter("standard"))).toEqual(["washer-standard"]);
    expect(getKeys(filter("high end"))).toEqual(["washer-high-end"]);
  });

  it("matches a specific issue name", () => {
    expect(getKeys(filter("no heat"))).toEqual(["oven-no-heat"]);
  });

  it("requires every word in a multi-term query to match", () => {
    expect(getKeys(filter("washer high"))).toEqual(["washer-high-end"]);
    expect(getKeys(filter("dryer high"))).toEqual([]);
  });

  it("matches user-facing skill kind labels", () => {
    expect(getKeys(filter("brand group"))).toEqual([
      "washer-standard",
      "washer-high-end",
    ]);
    expect(getKeys(filter("specific issue"))).toEqual(["oven-no-heat"]);
  });

  it("returns an empty array when no skills match", () => {
    expect(filter("refrigerator")).toEqual([]);
  });

  it("does not mutate the source array", () => {
    const originalKeys = getKeys(skills);

    filter("washer high");

    expect(getKeys(skills)).toEqual(originalKeys);
  });
});
