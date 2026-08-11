import { describe, expect, it } from "vitest";
import { EMPTY_UNIT_FORM_STATE } from "./manage-units.helpers";
import {
  getUnitSaveErrorMessage,
  validateUnitForm,
} from "./manage-units.validation";

describe("validateUnitForm", () => {
  it("requires the identity fields", () => {
    expect(validateUnitForm(EMPTY_UNIT_FORM_STATE)).toMatchObject({
      name: "Name cannot be empty",
      slug: "Slug cannot be empty",
    });
  });

  it("rejects malformed slugs and display order", () => {
    expect(
      validateUnitForm({
        ...EMPTY_UNIT_FORM_STATE,
        display_order: "1.5",
        name: "Washer",
        slug: "Washer Unit",
      }),
    ).toMatchObject({
      slug: "Use lowercase letters, numbers, and single hyphens",
      display_order: "Display order must be a whole number from 0 to 9999",
    });
  });

  it("accepts a normalized valid form", () => {
    expect(
      Object.values(
        validateUnitForm({
          ...EMPTY_UNIT_FORM_STATE,
          display_order: "20",
          name: "Stacked Washer",
          slug: "stacked-washer",
        }),
      ).filter(Boolean),
    ).toHaveLength(0);
  });
});

describe("getUnitSaveErrorMessage", () => {
  it("maps unique constraints by PostgreSQL error code", () => {
    const nameError = Object.assign(new Error("duplicate"), {
      code: "23505",
      details: "Key violates unit_name_key",
    });
    const slugError = Object.assign(new Error("duplicate"), {
      code: "23505",
      details: "Key violates unit_slug_key",
    });

    expect(getUnitSaveErrorMessage(nameError)).toBe(
      "A unit with this name already exists.",
    );
    expect(getUnitSaveErrorMessage(slugError)).toBe(
      "A unit with this slug already exists.",
    );
  });
});
