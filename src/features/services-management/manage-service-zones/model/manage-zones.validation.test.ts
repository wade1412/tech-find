import { describe, expect, it } from "vitest";
import { EMPTY_ZONE_FORM_STATE } from "./manage-zones.helpers";
import {
  getZoneSaveErrorMessage,
  validateZoneForm,
} from "./manage-zones.validation";

describe("validateZoneForm", () => {
  it("accepts a normalized valid zone", () => {
    expect(
      validateZoneForm({
        ...EMPTY_ZONE_FORM_STATE,
        name: "North Zone",
        slug: "north-zone",
      }),
    ).toEqual({
      display_order: undefined,
      name: undefined,
      slug: undefined,
    });
  });

  it("rejects invalid identity and display order values", () => {
    const errors = validateZoneForm({
      active: true,
      display_order: "10.5",
      name: " ",
      slug: "North_Zone",
    });

    expect(errors.name).toBe("Name cannot be empty");
    expect(errors.slug).toBe("Use lowercase letters, numbers, and single hyphens");
    expect(errors.display_order).toBe(
      "Display order must be a whole number from 0 to 9999",
    );
  });
});

describe("getZoneSaveErrorMessage", () => {
  it("maps unique constraints by PostgreSQL error code", () => {
    const nameError = Object.assign(new Error("duplicate"), {
      code: "23505",
      details: "Key violates service_zone_name_key",
    });
    const slugError = Object.assign(new Error("duplicate"), {
      code: "23505",
      details: "Key violates service_zone_slug_key",
    });

    expect(getZoneSaveErrorMessage(nameError)).toBe(
      "A service zone with this name already exists.",
    );
    expect(getZoneSaveErrorMessage(slugError)).toBe(
      "A service zone with this slug already exists.",
    );
  });

  it("preserves unrelated backend errors", () => {
    expect(getZoneSaveErrorMessage(new Error("Request failed"))).toBe(
      "Request failed",
    );
  });
});
