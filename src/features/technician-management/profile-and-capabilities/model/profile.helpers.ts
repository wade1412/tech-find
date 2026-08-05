import type { Technician } from "../../../../entities/technician/technician.types";
import { EDITABLE_TECHNICIAN_PROFILE_KEYS } from "./profile.constants";
import type {
  EditableKey,
  JobsPerDayDraft,
  TechnicianFormState,
} from "./profile.types";

type TechnicianPatch = Partial<Pick<Technician, EditableKey>>;

export const createTechnicianFormState = (
  technician: Technician,
): TechnicianFormState => {
  const entries = EDITABLE_TECHNICIAN_PROFILE_KEYS.map((key) => {
    if (key === "notes" && !technician[key]) {
      return [key, ""];
    }
    return [key, technician[key]];
  });

  return Object.fromEntries(entries) as TechnicianFormState;
};

export const parseJobsPerDayRange = (value: string): [number, number] => {
  const [min, max] = value.split("-").map(Number);

  return [min, max ?? min];
};

export const formatJobsPerDayRange = ({ min, max }: JobsPerDayDraft) =>
  min === max ? String(min) : `${min}-${max}`;

export const buildTechnicianPatch = (
  technician: Technician,
  draft: TechnicianFormState,
): TechnicianPatch => {
  const patch: Record<string, unknown> = {};

  for (const key of EDITABLE_TECHNICIAN_PROFILE_KEYS) {
    const draftValue = draft[key];
    const baseValue = technician[key];

    const cleanDraft =
      typeof draftValue === "string" ? draftValue.trim() : draftValue;
    const cleanBase =
      typeof baseValue === "string" ? baseValue.trim() : (baseValue ?? "");

    if (cleanDraft !== cleanBase) {
      if (key === "notes" && cleanDraft === "") {
        patch[key] = null;
      } else {
        patch[key] = cleanDraft;
      }
    }
  }

  return patch as TechnicianPatch;
};
