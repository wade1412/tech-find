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
  can_be_commercial: false,
  can_be_gas: true,
  can_be_stacked: false,
  display_order: 10,
  id: "unit-1",
  is_built_in: true,
  name: "Washer",
  slug: "washer",
};

describe("unit form helpers", () => {
  it("creates an editable draft without leaking the source object", () => {
    const draft = createUnitFormState(unit);

    expect(draft).toEqual({
      active: true,
      can_be_commercial: false,
      can_be_gas: true,
      can_be_stacked: false,
      display_order: "10",
      is_built_in: true,
      name: "Washer",
      slug: "washer",
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
