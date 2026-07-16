import { describe, expect, it } from "vitest";
import type { NewTechnicianDraft } from "./newTechnician.types";
import { buildCreateTechnicianInput } from "./newTechnician.helpers";

const createDraft = (): NewTechnicianDraft => ({
  profile: {
    active: true,
    alias: "  Alex  ",
    name: "  Alex Smith  ",
    notes: "   ",
    home_zip_code: " 12345 ",
    jobs_per_day: "2-5",
    gas: true,
    commercial: false,
    can_service_built_in: true,
    can_service_stacked_washer: false,
    can_service_stacked_dryer: true,
  },
  zoneIds: ["zone-1"],
  skills: [
    {
      key: "ui-skill-key",
      sourceId: null,
      unitId: "unit-1",
      kind: "brandGroup",
      brandGroupId: "brand-group-1",
    },
  ],
  ignoreList: [
    {
      key: "ui-ignore-key",
      sourceId: null,
      unit_id: "unit-1",
      brand_id: null,
      specific_issue_id: "issue-1",
    },
  ],
});

describe("buildCreateTechnicianInput", () => {
  it("normalizes profile values and excludes UI-only draft fields", () => {
    const input = buildCreateTechnicianInput(createDraft());

    expect(input.profile).toMatchObject({
      alias: "Alex",
      name: "Alex Smith",
      notes: null,
      home_zip_code: "12345",
    });
    expect(input.skills).toEqual([
      {
        unit_id: "unit-1",
        commercial: false,
        brand_group_id: "brand-group-1",
        specific_issue_id: null,
      },
    ]);
    expect(input.ignoreItems).toEqual([
      {
        unit_id: "unit-1",
        brand_id: null,
        specific_issue_id: "issue-1",
      },
    ]);
  });
});
