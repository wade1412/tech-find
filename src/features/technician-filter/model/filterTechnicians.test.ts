import { describe, expect, it } from "vitest";
import {
  makeFilterParams,
  makeIgnoreRule,
  makeSkill,
  makeTechnician,
  makeUnit,
} from "./filterTestFixtures";
import { filterTechnicians } from "./filterTechnicians";

// Helper: get technician ids
const getIds = (technicians: { id: string }[]) =>
  technicians.map((technician) => technician.id);

describe("filterTechnicians", () => {
  it("returns only technicians assigned to selected zone when no units are selected", () => {
    const tech1 = makeTechnician({ id: "tech-1", alias: "Alex" });
    const tech2 = makeTechnician({ id: "tech-2", alias: "Bill" });

    const params = makeFilterParams({
      technicians: [tech1, tech2],
      selectedZoneId: "zone-north",
      zonesByTechId: new Map([
        ["tech-1", new Set(["zone-north"])],
        ["tech-2", new Set(["zone-south"])],
      ]),
    });

    const result = filterTechnicians(params);

    expect(getIds(result)).toEqual(["tech-1"]);
  });

  it("requires technician to match every selected unit", () => {
    const washer = makeUnit({
      id: "unit-washer",
      name: "Washer",
      slug: "washer",
    });

    const dryer = makeUnit({
      id: "unit-dryer",
      name: "Dryer",
      slug: "dryer",
    });

    const tech1 = makeTechnician({ id: "tech-1", alias: "Alex" });
    const tech2 = makeTechnician({ id: "tech-2", alias: "Bill" });

    const params = makeFilterParams({
      technicians: [tech1, tech2],
      selectedUnits: [washer, dryer],
      selectedUnitIds: new Set(["unit-washer", "unit-dryer"]),
      skillsByTechId: new Map([
        [
          "tech-1",
          [
            makeSkill({
              id: "skill-1",
              technician_id: "tech-1",
              unit_id: "unit-washer",
            }),
            makeSkill({
              id: "skill-2",
              technician_id: "tech-1",
              unit_id: "unit-dryer",
            }),
          ],
        ],
        [
          "tech-2",
          [
            makeSkill({
              id: "skill-3",
              technician_id: "tech-2",
              unit_id: "unit-washer",
            }),
          ],
        ],
      ]),
      filter: {
        unitSlugs: ["washer", "dryer"],
      },
    });

    const result = filterTechnicians(params);

    expect(getIds(result)).toEqual(["tech-1"]);
  });

  it("keeps commercial technician when commercial skill exists and brand group is selected", () => {
    const washer = makeUnit({
      id: "unit-washer",
      name: "Washer",
      slug: "washer",
      can_be_commercial: true,
    });

    const tech1 = makeTechnician({
      id: "tech-1",
      alias: "Alex",
      commercial: true,
    });

    const params = makeFilterParams({
      technicians: [tech1],
      selectedUnits: [washer],
      selectedUnitIds: new Set(["unit-washer"]),
      selectedBrandIds: new Set(["brand-lg"]),
      selectedBrandGroupIds: new Set(["brand-group-standard"]),
      skillsByTechId: new Map([
        [
          "tech-1",
          [
            makeSkill({
              id: "skill-1",
              technician_id: "tech-1",
              unit_id: "unit-washer",
              brand_group_id: null,
              commercial: true,
            }),
          ],
        ],
      ]),
      filter: {
        unitSlugs: ["washer"],
        brandSlugs: ["lg"],
        isCommercial: true,
      },
    });

    const result = filterTechnicians(params);

    expect(getIds(result)).toEqual(["tech-1"]);
  });

  it("excludes technician when selected unit is in ignore list", () => {
    const washer = makeUnit({
      id: "unit-washer",
      name: "Washer",
      slug: "washer",
    });

    const tech1 = makeTechnician({
      id: "tech-1",
      alias: "Alex",
    });

    const params = makeFilterParams({
      technicians: [tech1],
      selectedUnits: [washer],
      selectedUnitIds: new Set(["unit-washer"]),
      skillsByTechId: new Map([
        [
          "tech-1",
          [
            makeSkill({
              id: "skill-1",
              technician_id: "tech-1",
              unit_id: "unit-washer",
            }),
          ],
        ],
      ]),
      ignoreListsByTechId: new Map([
        [
          "tech-1",
          [
            makeIgnoreRule({
              id: "ignore-1",
              technician_id: "tech-1",
              unit_id: "unit-washer",
            }),
          ],
        ],
      ]),
      filter: {
        unitSlugs: ["washer"],
      },
    });

    const result = filterTechnicians(params);

    expect(getIds(result)).toEqual([]);
  });

  it("excludes technician when selected brand is in ignore list", () => {
    const washer = makeUnit({
      id: "unit-washer",
      name: "Washer",
      slug: "washer",
    });

    const tech1 = makeTechnician({
      id: "tech-1",
      alias: "Alex",
    });

    const params = makeFilterParams({
      technicians: [tech1],
      selectedUnits: [washer],
      selectedUnitIds: new Set(["unit-washer"]),
      selectedBrandIds: new Set(["brand-lg"]),
      selectedBrandGroupIds: new Set(["brand-group-standard"]),
      skillsByTechId: new Map([
        [
          "tech-1",
          [
            makeSkill({
              id: "skill-1",
              technician_id: "tech-1",
              unit_id: "unit-washer",
              brand_group_id: "brand-group-standard",
            }),
          ],
        ],
      ]),
      ignoreListsByTechId: new Map([
        [
          "tech-1",
          [
            makeIgnoreRule({
              id: "ignore-1",
              technician_id: "tech-1",
              brand_id: "brand-lg",
            }),
          ],
        ],
      ]),
      filter: {
        unitSlugs: ["washer"],
        brandSlugs: ["lg"],
      },
    });

    const result = filterTechnicians(params);

    expect(getIds(result)).toEqual([]);
  });

  it("keeps technician when ignore list map is empty", () => {
    const washer = makeUnit({
      id: "unit-washer",
      name: "Washer",
      slug: "washer",
    });

    const tech1 = makeTechnician({
      id: "tech-1",
      alias: "Alex",
    });

    const params = makeFilterParams({
      technicians: [tech1],
      selectedUnits: [washer],
      selectedUnitIds: new Set(["unit-washer"]),
      skillsByTechId: new Map([
        [
          "tech-1",
          [
            makeSkill({
              id: "skill-1",
              technician_id: "tech-1",
              unit_id: "unit-washer",
            }),
          ],
        ],
      ]),
      ignoreListsByTechId: new Map(),
      filter: {
        unitSlugs: ["washer"],
      },
    });

    const result = filterTechnicians(params);

    expect(getIds(result)).toEqual(["tech-1"]);
  });
});
