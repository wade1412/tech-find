import { describe, expect, it } from "vitest";
import type { Unit } from "../../../../entities/unit/unit.types";
import { EMPTY_SPECIFIC_ISSUE_FORM_STATE } from "./manage-specific-issues.helpers";
import { validateSpecificIssueForm } from "./manage-specific-issues.validation";

const unit: Unit = {
  active: true,
  active_before_archive: null,
  archived_at: null,
  archived_by: null,
  can_be_commercial: false,
  can_be_gas: false,
  can_be_stacked: false,
  display_order: 10,
  id: "unit-1",
  is_built_in: false,
  name: "Dryer",
  slug: "dryer",
};

describe("validateSpecificIssueForm", () => {
  it("requires an available unit", () => {
    const validIdentity = {
      ...EMPTY_SPECIFIC_ISSUE_FORM_STATE,
      name: "No Heat",
      slug: "no-heat",
    };

    expect(validateSpecificIssueForm(validIdentity, [unit]).unit_id).toBe(
      "Select a unit",
    );
    expect(
      validateSpecificIssueForm(
        { ...validIdentity, unit_id: "missing" },
        [unit],
      ).unit_id,
    ).toBe("The selected unit is no longer available");
  });

  it("allows an inactive non-archived unit in edit mode", () => {
    const errors = validateSpecificIssueForm(
      {
        ...EMPTY_SPECIFIC_ISSUE_FORM_STATE,
        name: "No Heat",
        slug: "no-heat",
        unit_id: unit.id,
      },
      [{ ...unit, active: false }],
    );

    expect(errors.unit_id).toBeUndefined();
  });
});
