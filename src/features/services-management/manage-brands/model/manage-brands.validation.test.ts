import { describe, expect, it } from "vitest";
import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";
import { EMPTY_BRAND_FORM_STATE } from "./manage-brands.helpers";
import {
  getBrandSaveErrorMessage,
  validateBrandForm,
} from "./manage-brands.validation";

const activeGroup: BrandGroup = {
  active: true,
  active_before_archive: null,
  archived_at: null,
  archived_by: null,
  display_order: 10,
  id: "group-1",
  name: "Home Appliances",
  slug: "home-appliances",
};

describe("validateBrandForm", () => {
  it("requires a brand group", () => {
    const errors = validateBrandForm(
      {
        ...EMPTY_BRAND_FORM_STATE,
        name: "KitchenAid",
        slug: "kitchenaid",
      },
      [activeGroup],
    );

    expect(errors.group_id).toBe("Select a brand group");
  });

  it("rejects a group that is not in the available options", () => {
    const errors = validateBrandForm(
      {
        ...EMPTY_BRAND_FORM_STATE,
        name: "KitchenAid",
        slug: "kitchenaid",
        group_id: "missing-group",
      },
      [activeGroup],
    );

    expect(errors.group_id).toBe(
      "The selected brand group is no longer available",
    );
  });

  it("accepts an inactive non-archived group supplied by the edit page", () => {
    const errors = validateBrandForm(
      {
        ...EMPTY_BRAND_FORM_STATE,
        name: "KitchenAid",
        slug: "kitchenaid",
        group_id: activeGroup.id,
      },
      [{ ...activeGroup, active: false }],
    );

    expect(errors.group_id).toBeUndefined();
  });
});

describe("getBrandSaveErrorMessage", () => {
  it("maps unique name and slug constraints using the database error code", () => {
    const nameError = Object.assign(new Error("duplicate"), {
      code: "23505",
      details: "Key violates brand_name_key",
    });
    const slugError = Object.assign(new Error("duplicate"), {
      code: "23505",
      details: "Key violates brand_slug_key",
    });

    expect(getBrandSaveErrorMessage(nameError)).toBe(
      "A brand with this name already exists.",
    );
    expect(getBrandSaveErrorMessage(slugError)).toBe(
      "A brand with this slug already exists.",
    );
  });
});
