import type { TechnicianIgnoreList } from "../technicianIgnoreList.types";

export const makeIgnoreRule = (
  overrides: Partial<TechnicianIgnoreList> = {},
): TechnicianIgnoreList => ({
  id: "ignore-1",
  technician_id: "tech-1",
  unit_id: null,
  brand_id: null,
  specific_issue_id: null,
  ...overrides,
});
