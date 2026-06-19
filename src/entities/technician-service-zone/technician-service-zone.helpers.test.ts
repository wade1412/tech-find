import { describe, expect, it } from "vitest";
import type { ServiceZone } from "../service-zone/service-zone.types";
import type { TechnicianServiceZone } from "./technician-service-zone.types";
import { createTechnicianZoneNamesMap } from "./technician-service-zone.helpers";

const makeZone = (overrides: Partial<ServiceZone> = {}): ServiceZone => ({
  id: "zone-1",
  name: "Brooklyn",
  slug: "brooklyn",
  active: true,
  display_order: 1,
  ...overrides,
});

const makeRelation = (
  technician_id = "tech-1",
  zone_id = "zone-1",
): TechnicianServiceZone => ({ technician_id, zone_id });

describe("createTechnicianZoneNamesMap", () => {
  it("groups zone names by technician id", () => {
    const zones = [
      makeZone({ id: "zone-1", name: "North" }),
      makeZone({ id: "zone-2", name: "South" }),
      makeZone({ id: "zone-3", name: "Center" }),
    ];

    const relations = [
      makeRelation("tech-1", "zone-1"),
      makeRelation("tech-1", "zone-2"),
      makeRelation("tech-2", "zone-3"),
    ];

    const result = createTechnicianZoneNamesMap(zones, relations);

    expect(result).toEqual(
      new Map([
        ["tech-1", ["North", "South"]],
        ["tech-2", ["Center"]],
      ]),
    );
  });

  it("removes duplicate zones", () => {
    const zones = [
      makeZone({ id: "zone-1", name: "North" }),
      makeZone({ id: "zone-2", name: "South" }),
      makeZone({ id: "zone-3", name: "Center" }),
    ];

    const relations = [
      makeRelation("tech-1", "zone-1"),
      makeRelation("tech-1", "zone-2"),
      makeRelation("tech-2", "zone-3"),
      makeRelation("tech-2", "zone-3"),
    ];

    const result = createTechnicianZoneNamesMap(zones, relations);

    expect(result).toEqual(
      new Map([
        ["tech-1", ["North", "South"]],
        ["tech-2", ["Center"]],
      ]),
    );
  });

  it("ignores nonexistent zone ids", () => {
    const zones = [
      makeZone({ id: "zone-1", name: "North" }),
      makeZone({ id: "zone-2", name: "South" }),
      makeZone({ id: "zone-3", name: "Center" }),
    ];

    const relations = [
      makeRelation("tech-1", "zone-1"),
      makeRelation("tech-1", "zone-5"),
      makeRelation("tech-1", "zone-2"),
      makeRelation("tech-2", "zone-3"),
    ];

    const result = createTechnicianZoneNamesMap(zones, relations);

    expect(result).toEqual(
      new Map([
        ["tech-1", ["North", "South"]],
        ["tech-2", ["Center"]],
      ]),
    );
  });

  it("uses the existing map when it is passed as a parameter", () => {
    const zones = [
      makeZone({ id: "zone-1", name: "North" }),
      makeZone({ id: "zone-2", name: "South" }),
      makeZone({ id: "zone-3", name: "Center" }),
    ];

    const existingZonesMap = new Map([
      ["tech-1", new Set(["zone-2", "zone-3"])],
      ["tech-2", new Set(["zone-1"])],
    ]);

    const relations = [
      makeRelation("tech-1", "zone-1"),
      makeRelation("tech-1", "zone-2"),
      makeRelation("tech-2", "zone-3"),
    ];

    const result = createTechnicianZoneNamesMap(
      zones,
      relations,
      existingZonesMap,
    );

    expect(result).toEqual(
      new Map([
        ["tech-1", ["South", "Center"]],
        ["tech-2", ["North"]],
      ]),
    );
  });

  it("returns zones based on the display order", () => {
    const zones = [
      makeZone({ id: "zone-1", name: "North", display_order: 2 }),
      makeZone({ id: "zone-2", name: "South", display_order: 1 }),
    ];

    const relations = [
      makeRelation("tech-1", "zone-1"),
      makeRelation("tech-1", "zone-2"),
    ];

    const result = createTechnicianZoneNamesMap(zones, relations);

    expect(result.get("tech-1")).toEqual(["South", "North"]);
  });

  it("keeps a techanician whose relations have no valid zones", () => {
    const result = createTechnicianZoneNamesMap(
      [makeZone()],
      [makeRelation("tech-1", "missing-zone")],
    );

    expect(result).toEqual(new Map([["tech-1", []]]));
  });
});
