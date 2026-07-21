import { describe, expect, it } from "vitest";
import type { UserFormState } from "./editUser.types";
import { validateUserForm } from "./editUser.validation";

const validForm: UserFormState = {
  active: true,
  alias: "Alex",
  email: "alex@example.com",
  full_name: "Alex Johnson",
  role: "user",
};

describe("validateUserForm", () => {
  it("accepts a complete valid profile", () => {
    expect(validateUserForm(validForm)).toEqual({
      alias: null,
      email: null,
      full_name: null,
    });
  });

  it.each([
    ["alias", "   ", "Alias cannot be empty"],
    ["full_name", "   ", "Full name cannot be empty"],
    ["email", "invalid-email", "Enter a valid email address"],
  ] as const)("validates %s", (field, value, expectedMessage) => {
    expect(validateUserForm({ ...validForm, [field]: value })[field]).toBe(
      expectedMessage,
    );
  });

  it("rejects values over the database-facing limits", () => {
    const errors = validateUserForm({
      ...validForm,
      alias: "a".repeat(65),
      email: `${"a".repeat(243)}@example.com`,
      full_name: "a".repeat(121),
    });

    expect(errors.alias).toContain("64");
    expect(errors.email).toContain("254");
    expect(errors.full_name).toContain("120");
  });
});
