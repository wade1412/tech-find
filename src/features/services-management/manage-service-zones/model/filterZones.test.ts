import { describe, expect, it } from "vitest";
import type { ServiceZone } from "../../../../entities/service-zone/service-zone.types";
import { filterServiceZones } from "./filterZones";

const makeZone = (overrides: Partial<ServiceZone> = {}): ServiceZone => ({
  active: true,
  active_before_archive: null,
  archived_at: null,
  archived_by: null,
  display_order: 10,
  id: "zone-1",
  name: "North Zone",
  slug: "north-zone",
  ...overrides,
});

const zones = [
  makeZone(),
  makeZone({
    active: false,
    display_order: 20,
    id: "zone-2",
    name: "South Service Area",
    slug: "south-area",
  }),
];

describe("filterServiceZones", () => {
  it("filters by active status", () => {
    expect(
      filterServiceZones({
        serviceZones: zones,
        searchTerm: "",
        status: "inactive",
      }),
    ).toEqual([zones[1]]);
  });

  it("matches multiple terms across name, slug, and display order", () => {
    expect(
      filterServiceZones({
        serviceZones: zones,
        searchTerm: "south 20",
        status: "all",
      }),
    ).toEqual([zones[1]]);

    expect(
      filterServiceZones({
        serviceZones: zones,
        searchTerm: "NORTH-zone",
        status: "all",
      }),
    ).toEqual([zones[0]]);
  });
});
