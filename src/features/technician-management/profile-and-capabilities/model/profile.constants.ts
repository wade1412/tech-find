import type {
  CapabilityFieldConfig,
  EditableKey,
  ProfileFieldConfig,
} from "./profile.types";

export const PROFILE_FIELDS: ProfileFieldConfig[] = [
  { key: "alias", label: "Alias" },
  { key: "name", label: "Technician Name" },
  { key: "home_zip_code", label: "Home Zip Code" },
  { key: "jobs_per_day", label: "Jobs Per Day" },
  { key: "notes", label: "Notes" },
];
export const CAPABILITY_FIELDS: CapabilityFieldConfig[] = [
  {
    key: "can_service_stacked_dryer",
    label: "Stacked Dryer (Sliders)",
  },
  { key: "gas", label: "Gas" },
  {
    key: "can_service_stacked_washer",
    label: "Stacked Washer (Sliders)",
  },
  { key: "commercial", label: "Commercial" },
  { key: "can_service_built_in", label: "Built-In (Lift)" },
];

export const EDITABLE_KEYS: EditableKey[] = [
  "active",
  ...PROFILE_FIELDS.map((field) => field.key),
  ...CAPABILITY_FIELDS.map((field) => field.key),
];
