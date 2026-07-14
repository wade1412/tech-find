import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import DeleteTechnicianDialog from "./DeleteTechnicianDialog";

const renderDialog = (onConfirm = vi.fn()) => {
  render(
    <DeleteTechnicianDialog
      isOpen
      technicianAlias="Alex"
      isPending={false}
      error={null}
      onClose={vi.fn()}
      onConfirm={onConfirm}
    />,
  );

  return { onConfirm };
};

describe("DeleteTechnicianDialog", () => {
  it("explains the cascade and keeps confirmation disabled initially", () => {
    renderDialog();

    expect(
      screen.getByText(/service zones, skills, and ignore-list items/i),
    ).toBeTruthy();

    const confirmButton = screen.getByRole("button", {
      name: "Delete permanently",
    }) as HTMLButtonElement;

    expect(confirmButton.disabled).toBe(true);
  });

  it("requires an exact alias before confirming deletion", async () => {
    const user = userEvent.setup();
    const { onConfirm } = renderDialog();
    const confirmationInput = screen.getByRole("textbox", {
      name: "Technician alias confirmation",
    });
    const confirmButton = screen.getByRole("button", {
      name: "Delete permanently",
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
