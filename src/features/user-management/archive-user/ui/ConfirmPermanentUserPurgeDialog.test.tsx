import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { User } from "../../../../entities/user/user.types";
import ConfirmPermanentUserPurgeDialog from "./ConfirmPermanentUserPurgeDialog";

const archivedUser: User = {
  active: false,
  active_before_archive: true,
  alias: "Alex",
  archived_at: "2026-07-24T12:00:00.000Z",
  archived_by: "11111111-1111-4111-8111-111111111111",
  created_at: "2026-01-01T00:00:00.000Z",
  email: "alex@example.com",
  full_name: "Alex Johnson",
  id: "22222222-2222-4222-8222-222222222222",
  role: "user",
  updated_at: "2026-07-24T12:00:00.000Z",
};

describe("ConfirmPermanentUserPurgeDialog", () => {
  it("requires the exact alias and explains that audit history is retained", async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();

    render(
      <ConfirmPermanentUserPurgeDialog
        user={archivedUser}
        isPending={false}
        error={null}
        onClose={vi.fn()}
        onConfirm={onConfirm}
      />,
    );

    expect(screen.getByText(/audit trail is retained/i)).not.toBeNull();

    const confirmationInput = screen.getByRole("textbox", {
      name: "User alias confirmation",
    });
    const confirmButton = screen.getByRole<HTMLButtonElement>("button", {
      name: "Purge permanently",
    });

    expect(confirmButton.disabled).toBe(true);
    await user.type(confirmationInput, "alex");
    expect(confirmButton.disabled).toBe(true);

    await user.clear(confirmationInput);
    await user.type(confirmationInput, "Alex");
    expect(confirmButton.disabled).toBe(false);

    await user.click(confirmButton);
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
