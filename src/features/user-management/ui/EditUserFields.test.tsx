import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { UserFormState } from "../model/editUser.types";
import EditUserFields from "./EditUserFields";

afterEach(cleanup);

const formState: UserFormState = {
  active: true,
  alias: "Alex",
  email: "alex@example.com",
  full_name: "Alex Johnson",
  role: "secondary_admin",
};

describe("EditUserFields", () => {
  it("renders accessible Email and Role controls with current values", () => {
    render(
      <EditUserFields
        formState={formState}
        errors={null}
        allowedRoles={["user", "secondary_admin", "main_admin", "owner"]}
        disabledProfile={false}
        disabledAccess={false}
        onTextChange={vi.fn()}
        onRoleChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("textbox", { name: "Email" })).toHaveProperty(
      "value",
      "alex@example.com",
    );
    expect(screen.getByRole("combobox", { name: "Role" })).toHaveProperty(
      "value",
      "Secondary Admin",
    );
  });

  it("emits the selected role from Autocomplete", async () => {
    const onRoleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <EditUserFields
        formState={formState}
        errors={null}
        allowedRoles={["user", "secondary_admin"]}
        disabledProfile={false}
        disabledAccess={false}
        onTextChange={vi.fn()}
        onRoleChange={onRoleChange}
      />,
    );

    await user.click(screen.getByRole("combobox", { name: "Role" }));
    expect(screen.queryByRole("option", { name: "Owner" })).toBeNull();
    await user.click(screen.getByRole("option", { name: "User" }));

    expect(onRoleChange).toHaveBeenCalledWith("user");
  });

  it("keeps a disabled current role visible when it is not assignable", () => {
    render(
      <EditUserFields
        formState={{ ...formState, role: "main_admin" }}
        errors={null}
        allowedRoles={["user", "secondary_admin"]}
        disabledProfile={false}
        disabledAccess
        onTextChange={vi.fn()}
        onRoleChange={vi.fn()}
      />,
    );

    const roleInput = screen.getByRole("combobox", { name: "Role" });
    expect(roleInput).toHaveProperty("value", "Main Admin");
    expect(roleInput).toHaveProperty("disabled", true);
  });
});
