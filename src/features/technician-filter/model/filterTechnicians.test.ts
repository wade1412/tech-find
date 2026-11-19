import { describe, expect, it } from "vitest";
import { makeFilterParams } from "./filterTestFixtures";
import { filterTechnicians } from "./filterTechnicians";
import { makeUnit } from "../../../entities/unit/testing/unit.factory";
import { makeTechnician } from "../../../entities/technician/testing/technician.factory";
import { makeIgnoreRule } from "../../../entities/technician-ignore-list/testing/ignore-list.factory";
import { makeSkill } from "../../../entities/technician-skill-set/testing/technician-skill-set.factory";

// Helper: get technician ids
const getIds = (technicians: { id: string }[]) =>
  technicians.map((technician) => technician.id);

describe("filterTechnicians", () => {
  // -------- General Tests --------
  // 1) Zone match
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
  // 2) Match all selected units
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
  // 3) Built-In flag check and built-in skill check
  it("requires both the lift capability and the exact skill for a built-in unit", () => {
    const wallOven = makeUnit({
      id: "unit-wall-oven",
      name: "Wall Oven",
      slug: "wall-oven",
      is_built_in: true,
    });

    const fullyQualified = makeTechnician({
      id: "tech-qualified",
      can_service_built_in: true,
    });
    const skillOnly = makeTechnician({
      id: "tech-skill-only",
      can_service_built_in: false,
    });
    const liftOnly = makeTechnician({
      id: "tech-lift-only",
      can_service_built_in: true,
    });

    const params = makeFilterParams({
      technicians: [fullyQualified, skillOnly, liftOnly],
      selectedUnits: [wallOven],
      selectedUnitIds: new Set([wallOven.id]),
      skillsByTechId: new Map([
        [
          fullyQualified.id,
          [
            makeSkill({
              id: "qualified-wall-oven-skill",
              technician_id: fullyQualified.id,
              unit_id: wallOven.id,
            }),
          ],
        ],
        [
          skillOnly.id,
          [
            makeSkill({
              id: "skill-only-wall-oven-skill",
              technician_id: skillOnly.id,
              unit_id: wallOven.id,
            }),
          ],
        ],
      ]),
      filter: {
        unitSlugs: [wallOven.slug],
      },
    });

    expect(getIds(filterTechnicians(params))).toEqual([fullyQualified.id]);
  });
  // 4) Installation flag requires the technician to have both the installation capability and a relevant unit skill
  it("matches the technician, when the installatio job option is selected only if he has the capability and the unit skill", () => {
    const dryerForInstallation = makeUnit({
      id: "dryer",
      name: "Dryer",
      slug: "Dryer",
      can_be_installed: true,
    });

    const fullyQualified = makeTechnician({
      id: "tech-qualified",
      can_provide_installation: true,
    });
    const capabilityOnly = makeTechnician({
      id: "installation-only",
      can_provide_installation: true,
    });
    const skillOnly = makeTechnician({
      id: "tech-skill-only",
      can_service_built_in: false,
    });

    const params = makeFilterParams({
      technicians: [fullyQualified, capabilityOnly, skillOnly],
      selectedUnits: [dryerForInstallation],
      selectedUnitIds: new Set([dryerForInstallation.id]),
      skillsByTechId: new Map([
        [
          fullyQualified.id,
          [
            makeSkill({
              id: "qualified-dryer-installation-skill",
              technician_id: fullyQualified.id,
              unit_id: dryerForInstallation.id,
            }),
          ],
        ],
        [
          capabilityOnly.id,
          [
            makeSkill({
              id: "skill-for-some-other-unit",
              technician_id: capabilityOnly.id,
              unit_id: "44",
            }),
          ],
        ],
        [
          skillOnly.id,
          [
            makeSkill({
              id: "unit-only-skill",
              technician_id: skillOnly.id,
              unit_id: dryerForInstallation.id,
            }),
          ],
        ],
      ]),
      filter: {
        unitSlugs: [dryerForInstallation.slug],
        isInstallation: true,
      },
    });

    expect(getIds(filterTechnicians(params))).toEqual([fullyQualified.id]);
  });
  // 5) Selected brands are ignored on commercial flag
  it("matches the technician with commercial capability, when commercial skill exists and brand group is selected", () => {
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

  // -------- Brand Group Tests --------
  // 1) Match the technician with the selected brand group
  it("matches the technician when technician has the selected brand group skill", () => {
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
      filter: {
        unitSlugs: ["washer"],
        brandSlugs: ["lg"],
      },
    });

    const result = filterTechnicians(params);

    expect(getIds(result)).toEqual(["tech-1"]);
  });
  // 2) Filter out the technician without the needed skill
  it("excludes technician when technician does not have selected brand group skill", () => {
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
              brand_group_id: "brand-group-high-end",
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

  // -------- Ignore List Tests --------
  // 1) Filter out the technician that has the selected unit in his ignore list
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
  // 2) Filter out the technician that has the selected brand in his ignore list
  // Brand specific test: the technician may be able to service ALL standard brands,
  // but if he has one of the standard brands in his ignore list - he will be filtered out
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
  // 3) Match the technician if his ignore List is empty
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

  // -------- Specific Issues Tests --------
  // 1) Match the technician that has the selected specific issue skill
  it("keeps technician when selected issue belongs to selected unit and technician supports it", () => {
    const fridge = makeUnit({
      id: "unit-fridge",
      name: "Fridge",
      slug: "fridge",
    });

    const tech1 = makeTechnician({
      id: "tech-1",
      alias: "Alex",
    });

    const params = makeFilterParams({
      technicians: [tech1],
      selectedUnits: [fridge],
      selectedUnitIds: new Set(["unit-fridge"]),
      selectedIssueIds: new Set(["issue-compressor"]),
      selectedIssueIdsByUnitId: new Map([
        ["unit-fridge", new Set(["issue-compressor"])],
      ]),
      skillsByTechId: new Map([
        [
          "tech-1",
          [
            makeSkill({
              id: "skill-base-fridge",
              technician_id: "tech-1",
              unit_id: "unit-fridge",
              specific_issue_id: null,
            }),
            makeSkill({
              id: "skill-compressor",
              technician_id: "tech-1",
              unit_id: "unit-fridge",
              specific_issue_id: "issue-compressor",
            }),
          ],
        ],
      ]),
      filter: {
        unitSlugs: ["fridge"],
        specificIssueSlugs: ["compressor-repair"],
      },
    });

    const result = filterTechnicians(params);

    expect(getIds(result)).toEqual(["tech-1"]);
  });
  // 2) Ignore the selected specific issue skill, if it does not match the selected unit
  it("does not match issue skill from another unit", () => {
    const fridge = makeUnit({
      id: "unit-fridge",
      name: "Fridge",
      slug: "fridge",
    });

    const tech1 = makeTechnician({
      id: "tech-1",
      alias: "Alex",
    });

    const params = makeFilterParams({
      technicians: [tech1],
      selectedUnits: [fridge],
      selectedUnitIds: new Set(["unit-fridge"]),
      selectedIssueIds: new Set(["issue-compressor"]),
      selectedIssueIdsByUnitId: new Map([
        ["unit-fridge", new Set(["issue-compressor"])],
      ]),
      skillsByTechId: new Map([
        [
          "tech-1",
          [
            makeSkill({
              id: "skill-base-fridge",
              technician_id: "tech-1",
              unit_id: "unit-fridge",
              specific_issue_id: null,
            }),
            makeSkill({
              id: "skill-washer-compressor",
              technician_id: "tech-1",
              unit_id: "unit-washer",
              specific_issue_id: "issue-compressor",
            }),
          ],
        ],
      ]),
      filter: {
        unitSlugs: ["fridge"],
        specificIssueSlugs: ["compressor-repair"],
      },
    });

    const result = filterTechnicians(params);

    expect(getIds(result)).toEqual([]);
  });
});
