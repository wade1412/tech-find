import { describe, expect, it } from "vitest";
import type { Unit } from "../../../../entities/unit/unit.types";
import {
  buildUnitPatch,
  createUnitFormState,
  EMPTY_UNIT_FORM_STATE,
  isNewUnitFormDirty,
  normalizeUnitFormState,
} from "./manage-units.helpers";

const unit: Unit = {
  active: true,
  display_order: 10,
  id: "unit-1",
  name: "Washer",
  slug: "washer",
  active_before_archive: null,
  archived_at: null,
  archived_by: null,
  can_be_gas: true,
  can_be_stacked: false,
  can_be_installed: false,
  is_built_in: true,
  can_be_commercial: false,
};

describe("unit form helpers", () => {
  it("creates an editable draft without leaking the source object", () => {
    const draft = createUnitFormState(unit);

    expect(draft).toEqual({
      active: true,
      display_order: "10",
      name: "Washer",
      slug: "washer",
      can_be_gas: true,
      can_be_stacked: false,
      can_be_installed: false,
      is_built_in: true,
      can_be_commercial: false,
    });
    expect(draft).not.toBe(unit);
  });

  it("normalizes text and display order before persistence", () => {
    expect(
      normalizeUnitFormState({
        ...EMPTY_UNIT_FORM_STATE,
        display_order: " 12 ",
        name: "  Dryer  ",
        slug: "  DRYER-UNIT  ",
      }),
    ).toMatchObject({
      display_order: 12,
      name: "Dryer",
      slug: "dryer-unit",
    });
  });

  it("builds a minimal patch", () => {
    expect(
      buildUnitPatch(unit, {
        ...createUnitFormState(unit),
        can_be_commercial: true,
        name: " Washer ",
      }),
    ).toEqual({ can_be_commercial: true });
  });

  it("detects dirty new-unit forms", () => {
    expect(isNewUnitFormDirty(EMPTY_UNIT_FORM_STATE)).toBe(false);
    expect(
      isNewUnitFormDirty({ ...EMPTY_UNIT_FORM_STATE, name: "Dryer" }),
    ).toBe(true);
  });
});
