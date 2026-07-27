import type {
  Unit,
  UnitInsert,
  UnitUpdate,
} from "../../../../entities/unit/unit.types";
import type { UnitFormState } from "./manage-units.types";

export const createUnitFormState = (unit: Unit): UnitFormState => {
  return {
    active: unit.active,
    can_be_commercial: unit.can_be_commercial,
    can_be_gas: unit.can_be_gas,
    can_be_stacked: unit.can_be_stacked,
    display_order: String(unit.display_order),
    is_built_in: unit.is_built_in,
    name: unit.name,
    slug: unit.slug,
  };
};

export const EMPTY_UNIT_FORM_STATE: UnitFormState = {
  active: true,
  can_be_commercial: false,
  can_be_gas: false,
  can_be_stacked: false,
  display_order: "999",
  is_built_in: false,
  name: "",
  slug: "",
};

export const normalizeUnitFormState = (
  formState: UnitFormState,
): UnitInsert => ({
  active: formState.active,
  can_be_commercial: formState.can_be_commercial,
  can_be_gas: formState.can_be_gas,
  can_be_stacked: formState.can_be_stacked,
  display_order: Number(formState.display_order),
  is_built_in: formState.is_built_in,
  name: formState.name.trim(),
  slug: formState.slug.trim().toLowerCase(),
});

export const buildUnitPatch = (
  unit: Unit,
  formState: UnitFormState,
): UnitUpdate => {
  const normalized = normalizeUnitFormState(formState);
  const patch: UnitUpdate = {};

  for (const key of Object.keys(normalized) as (keyof UnitInsert)[]) {
    if (normalized[key] !== unit[key]) {
      Object.assign(patch, { [key]: normalized[key] });
    }
  }

  return patch;
};

export const isNewUnitFormDirty = (formState: UnitFormState): boolean => {
  const normalized = normalizeUnitFormState(formState);
  const initial = normalizeUnitFormState(EMPTY_UNIT_FORM_STATE);

  return Object.keys(normalized).some(
    (key) =>
      normalized[key as keyof UnitInsert] !==
      initial[key as keyof UnitInsert],
  );
};
