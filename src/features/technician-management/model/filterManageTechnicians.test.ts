import { describe, expect, it } from "vitest";
import { makeTechnician } from "../../technician-filter/model/filterTestFixtures";
import type { Technician } from "../../../entities/technician/technician.types";
import type { ManageTechniciansListFilterValue } from "./manageTechnicians.constants";
import { filterManageTechnicians } from "./filterManageTechnicians";

const technicians = [
  makeTechnician({
    id: "tech-1",
    alias: "Brian H.",
    name: "Brian Howard",
    home_zip_code: "28110",
    active: true,
  }),
  makeTechnician({
    id: "tech-2",
    alias: "Michael",
    name: "Michael Stone",
    home_zip_code: "28056",
    active: false,
  }),
];

const zoneNamesByTechnicianId = new Map([
  ["tech-1", ["Center", "East"]],
  ["tech-2", ["North", "West"]],
]);

const getIds = (items: Technician[]) => items.map(({ id }) => id);

const filter = (
  searchTerm: string,
  status: ManageTechniciansListFilterValue = "all",
) =>
  filterManageTechnicians({
    technicians,
    searchTerm,
    status,
    zoneNamesByTechnicianId,
  });

describe("filterManageTechnicians", () => {
  it.each(["", "       ", "---", ",,,"])(
    "returns all technicians for an empty normalized search term: %j",
    (searchTerm) => {
      expect(getIds(filter(searchTerm))).toEqual(["tech-1", "tech-2"]);
    },
  );

  const searchableCases: Array<[string, string[]]> = [
    ["brian", ["tech-1"]],
    ["HOWARD", ["tech-1"]],
    ["28110", ["tech-1"]],
    ["north", ["tech-2"]],
    ["Michael West", ["tech-2"]],
  ];

  it.each(searchableCases)(
    "matches searchable technician data for %j",
    (searchTerm, expectedIds) => {
      expect(getIds(filter(searchTerm))).toEqual(expectedIds);
    },
  );

  it.each([
    "CENTER - EAST",
    "Center, East",
    "Center     East",
    "Center / East",
    "Center \u2014 East",
  ])("ignores punctuation and repeated whitespace in %j", (searchTerm) => {
    expect(getIds(filter(searchTerm))).toEqual(["tech-1"]);
  });

  it("normalizes punctuation in indexed technician fields", () => {
    expect(getIds(filter("Brian H"))).toEqual(["tech-1"]);
  });

  it("returns no technicians when every search term cannot be matched", () => {
    expect(filter("Michael East")).toEqual([]);
  });

  it.each([
    ["active", ["tech-1"]],
    ["inactive", ["tech-2"]],
    ["all", ["tech-1", "tech-2"]],
  ] as const)("applies the %s status filter", (status, expectedIds) => {
    expect(getIds(filter("", status))).toEqual(expectedIds);
  });

  it("combines status and search filters", () => {
    expect(getIds(filter("North", "inactive"))).toEqual(["tech-2"]);
    expect(filter("North", "active")).toEqual([]);
  });

  it("does not mutate the source technicians array", () => {
    const initialIds = getIds(technicians);

    filter("Center", "active");

    expect(getIds(technicians)).toEqual(initialIds);
  });
});
