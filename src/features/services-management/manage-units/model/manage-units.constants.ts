import type {
  EditableUnitKey,
  UnitProfileFieldConfig,
  UnitPropertyFieldConfig,
} from "./manage-units.types";

export const UNIT_PROFILE_FIELDS: UnitProfileFieldConfig[] = [
  { key: "name", label: "Name" },
  { key: "slug", label: "Slug" },
  { key: "display_order", label: "Display Order" },
];
export const UNIT_PROPERTY_FIELDS: UnitPropertyFieldConfig[] = [
  {
    key: "can_be_commercial",
    label: "Commercial",
  },
  { key: "can_be_gas", label: "Gas" },
  {
    key: "can_be_stacked",
    label: "Stacked (Sliders)",
  },
  { key: "is_built_in", label: "Built-In (Lift)" },
];

export const EDITABLE_UNIT_KEYS: EditableUnitKey[] = [
  "active",
  ...UNIT_PROFILE_FIELDS.map((field) => field.key),
  ...UNIT_PROPERTY_FIELDS.map((field) => field.key),
];
