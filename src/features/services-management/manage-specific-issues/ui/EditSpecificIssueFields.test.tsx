import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Unit } from "../../../../entities/unit/unit.types";
import type { SpecificIssueFormState } from "../model/manage-specific-issues.types";
import EditSpecificIssueFields from "./EditSpecificIssueFields";

afterEach(cleanup);

const units: Unit[] = [
  {
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
  },
  {
    active: false,
    active_before_archive: null,
    archived_at: null,
    archived_by: null,
    can_be_commercial: false,
    can_be_gas: false,
    can_be_stacked: false,
    display_order: 20,
    id: "unit-2",
    is_built_in: false,
    name: "Legacy Washer",
    slug: "legacy-washer",
  },
];

const formState: SpecificIssueFormState = {
  active: true,
  name: "No Heat",
  slug: "no-heat",
  unit_id: "unit-1",
};

describe("EditSpecificIssueFields", () => {
  it("uses an autocomplete and emits the selected unit id", async () => {
    const onFieldChange = vi.fn();
    const user = userEvent.setup();

    render(
      <EditSpecificIssueFields
        disabled={false}
        errors={null}
        formState={formState}
        onFieldChange={onFieldChange}
        units={units}
      />,
    );

    const select = screen.getByRole("combobox", { name: "Unit" });
    expect(select).toHaveProperty("value", "Dryer");
    await user.click(select);
    await user.click(
      screen.getByRole("option", { name: "Legacy Washer (Inactive)" }),
    );

    expect(onFieldChange).toHaveBeenCalledWith("unit_id", "unit-2");
  });
});
