import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Unit } from "../../../../../entities/unit/unit.types";
import ConfirmPermanentUnitPurgeDialog from "./ConfirmPermanentUnitPurgeDialog";

const archivedUnit: Unit = {
  active: false,
  active_before_archive: true,
  archived_at: "2026-07-27T12:00:00.000Z",
  archived_by: "11111111-1111-4111-8111-111111111111",
  can_be_commercial: false,
  can_be_gas: true,
  can_be_stacked: false,
  display_order: 20,
  id: "22222222-2222-4222-8222-222222222222",
  is_built_in: false,
  name: "Dryer",
  slug: "dryer",
};

describe("ConfirmPermanentUnitPurgeDialog", () => {
  it("requires the exact name and explains cascading deletion", async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();

    render(
      <ConfirmPermanentUnitPurgeDialog
        unit={archivedUnit}
        isPending={false}
        error={null}
        onClose={vi.fn()}
        onConfirm={onConfirm}
      />,
    );

    expect(screen.getByText(/specific issues/i)).toBeTruthy();
    expect(screen.getByText(/technician skills/i)).toBeTruthy();

    const input = screen.getByRole("textbox", {
      name: "Unit name confirmation",
    });
    const button = screen.getByRole<HTMLButtonElement>("button", {
      name: "Purge permanently",
    });

    expect(button.disabled).toBe(true);
    await user.type(input, "dryer");
    expect(button.disabled).toBe(true);

    await user.clear(input);
    await user.type(input, "Dryer");
    expect(button.disabled).toBe(false);

    await user.click(button);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
