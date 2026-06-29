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
      addedIds: ["added"],
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

  it("does not mutate original sets", () => {
    const initialSet = new Set(["1"]);
    const draftSet = new Set(["2", "3"]);

    buildTechnicianZonesPatch(initialSet, draftSet);

    expect(Array.from(initialSet)).toEqual(["1"]);
    expect(Array.from(draftSet)).toEqual(["2", "3"]);
  });
});
