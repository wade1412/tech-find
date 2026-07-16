import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { makeTechnician } from "../../../technician-filter/model/filterTestFixtures";
import ConfirmPermanentTechnicianPurgeDialog from "./ConfirmPermanentTechnicianPurgeDialog";

const archivedTechnician = makeTechnician({
  alias: "Alex",
  active: false,
  active_before_archive: true,
  archived_at: "2026-07-16T12:00:00.000Z",
});

const renderDialog = (onConfirm = vi.fn()) => {
  render(
    <ConfirmPermanentTechnicianPurgeDialog
      technician={archivedTechnician}
      isPending={false}
      error={null}
      onClose={vi.fn()}
      onConfirm={onConfirm}
    />,
  );

  return { onConfirm };
};

describe("ConfirmPermanentTechnicianPurgeDialog", () => {
  it("explains the cascade and keeps confirmation disabled initially", () => {
    renderDialog();

    expect(
      screen.getByText(/service zones, skills, and ignore-list items/i),
    ).toBeTruthy();

    const confirmButton = screen.getByRole("button", {
      name: "Purge permanently",
    }) as HTMLButtonElement;

    expect(confirmButton.disabled).toBe(true);
  });

  it("requires the exact alias before permanent purge", async () => {
    const user = userEvent.setup();
    const { onConfirm } = renderDialog();
    const confirmationInput = screen.getByRole("textbox", {
      name: "Technician alias confirmation",
    });
    const confirmButton = screen.getByRole("button", {
      name: "Purge permanently",
    }) as HTMLButtonElement;

    await user.type(confirmationInput, "alex");
    expect(confirmButton.disabled).toBe(true);

    await user.clear(confirmationInput);
    await user.type(confirmationInput, "Alex");
    expect(confirmButton.disabled).toBe(false);

    await user.click(confirmButton);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
