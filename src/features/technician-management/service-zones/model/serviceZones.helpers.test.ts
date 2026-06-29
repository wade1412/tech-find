import { describe, it, expect } from "vitest";
import { buildTechnicianZonesPatch } from "./serviceZones.helpers";

describe("buildTechnicianZonesPatch", () => {
  it("returns empty patch on identical sets", () => {
    const initialSet = new Set(["1", "2"]);
    const draftSet = new Set(["1", "2"]);

    expect(buildTechnicianZonesPatch(initialSet, draftSet)).toEqual({
      addedIds: [],
      removedIds: [],
    });
  });

  it("returns empty patch on identical sets with different value order", () => {
    const initialSet = new Set(["1", "2"]);
    const draftSet = new Set(["2", "1"]);

    expect(buildTechnicianZonesPatch(initialSet, draftSet)).toEqual({
      addedIds: [],
      removedIds: [],
    });
  });

  it("returns added IDs in patch", () => {
    const initialSet = new Set(["1", "2"]);
    const draftSet = new Set(["1", "2", "added"]);

    expect(buildTechnicianZonesPatch(initialSet, draftSet)).toEqual({
      addedIds: ["added"],
      removedIds: [],
    });
  });

  it("returns removed IDs in patch ", () => {
    const initialSet = new Set(["1", "2", "removed"]);
    const draftSet = new Set(["1", "2"]);

    expect(buildTechnicianZonesPatch(initialSet, draftSet)).toEqual({
      addedIds: [],
      removedIds: ["removed"],
    });
  });

  it("returns added and removed IDs in patch", () => {
    const initialSet = new Set(["1", "2", "removed"]);
    const draftSet = new Set(["1", "2", "added"]);

    expect(buildTechnicianZonesPatch(initialSet, draftSet)).toEqual({
      addedIds: ["added"],
      removedIds: ["removed"],
    });
  });

  it("returns all IDs as added in patch on empty initial set", () => {
    const initialSet = new Set([]);
    const draftSet = new Set(["1", "2", "3"]);

    expect(buildTechnicianZonesPatch(initialSet, draftSet)).toEqual({
      addedIds: ["1", "2", "3"],
      removedIds: [],
    });
  });

  it("returns all IDs as removed in patch on empty draft set", () => {
    const initialSet = new Set(["1", "2", "3"]);
    const draftSet = new Set([]);

    expect(buildTechnicianZonesPatch(initialSet, draftSet)).toEqual({
      addedIds: [],
      removedIds: ["1", "2", "3"],
    });
  });

  it("does not mutate original sets", () => {
    const initialSet = new Set(["1"]);
    const draftSet = new Set(["2", "3"]);

    buildTechnicianZonesPatch(initialSet, draftSet);

    expect(Array.from(initialSet)).toEqual(["1"]);
    expect(Array.from(draftSet)).toEqual(["2", "3"]);
  });
});
