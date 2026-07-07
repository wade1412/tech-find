import type { Technician } from "../../../../entities/technician/technician.types";

export type ProfileFieldKey =
  | "alias"
  | "name"
  | "home_zip_code"
  | "jobs_per_day"
  | "notes";

export type CapabilityFieldKey =
  | "gas"
  | "commercial"
  | "can_service_built_in"
  | "can_service_stacked_washer"
  | "can_service_stacked_dryer";

export type EditableKey = "active" | ProfileFieldKey | CapabilityFieldKey;

export type ProfileFieldConfig = {
  key: ProfileFieldKey;
  label: string;
};

export type CapabilityFieldConfig = {
  key: CapabilityFieldKey;
  label: string;
};

export type TechnicianFormState = {
  [K in EditableKey]: K extends "notes" ? string : Technician[K];
};

export type JobsPerDayDraft = {
  min: number;
  max: number;
};
