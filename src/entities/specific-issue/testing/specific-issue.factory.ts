import type { SpecificIssue } from "../specific-issue.types";

export const makeIssue = (
  overrides: Partial<SpecificIssue> = {},
): SpecificIssue => ({
  active: true,
  active_before_archive: null,
  archived_at: null,
  archived_by: null,
  id: "issue-1",
  name: "No Heat",
  slug: "no-heat",
  unit_id: "unit-1",
  ...overrides,
});
