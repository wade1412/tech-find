import type { TechnicianSkill } from "../technicianSkillSet.types";

export const makeSkill = (
  overrides: Partial<TechnicianSkill> = {},
): TechnicianSkill => ({
  id: "skill-1",
  technician_id: "tech-1",
  unit_id: "unit-1",
  brand_group_id: null,
  specific_issue_id: null,
  commercial: false,
  ...overrides,
});
