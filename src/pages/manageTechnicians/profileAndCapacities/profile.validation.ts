import { parseJobsPerDayRange } from "./profile.helpers";
import type { TechnicianFormState } from "./profile.types";

export type ProfileValidationErrors = Partial<
  Record<keyof TechnicianFormState, string | null>
>;

type ValidateProfileInputFunction = (
  value: string,
  propertyName: keyof TechnicianFormState,
) => string | null;

const FIELD_LABEL: Partial<Record<keyof TechnicianFormState, string>> = {
  alias: "Alias",
  name: "Name",
  home_zip_code: "ZIP code",
  jobs_per_day: "Jobs Range",
  notes: "Notes",
};

const validateName: ValidateProfileInputFunction = (value, propertyName) => {
  const invalidNameCharsRegex = /[^a-zA-Z\s'-]/;

  const trimmedVal = value.trim();

  if (!trimmedVal) {
    return `${FIELD_LABEL[propertyName]} cannot be empty`;
  }
  if (invalidNameCharsRegex.test(value)) {
    return `${FIELD_LABEL[propertyName]} cannot contain numbers or special characters`;
  }
  if (trimmedVal.length > 16) {
    return `${FIELD_LABEL[propertyName]} cannot be longer than 16 characters`;
  }

  return null;
};

const validateZip: ValidateProfileInputFunction = (value, propertyName) => {
  const zipRegex = /^\d{5}$/;

  const trimmedVal = value.trim();

  if (trimmedVal.length !== 5) {
    return `${FIELD_LABEL[propertyName]} must contain exactly 5 digits`;
  }

  if (!zipRegex.test(trimmedVal)) {
    return `${FIELD_LABEL[propertyName]} must contain numbers only`;
  }

  return null;
};

const validateJobsPerDay: ValidateProfileInputFunction = (
  value,
  propertyName,
) => {
  const jobsRegex = /^([1-9])(?:-([1-9]))?$/;

  if (!jobsRegex.test(value)) {
    return `${FIELD_LABEL[propertyName]} has invalid format`;
  }

  const [min, max] = parseJobsPerDayRange(value);

  if (min > max) {
    return `${FIELD_LABEL[propertyName]} has invalid format`;
  }

  return null;
};

const validateNotes: ValidateProfileInputFunction = (value, propertyName) => {
  if (value.trim().length > 72) {
    return `${FIELD_LABEL[propertyName]} cannot be longer than 72 characters`;
  }

  return null;
};

export const validateProfileForm = (
  profileForm: TechnicianFormState,
): ProfileValidationErrors => {
  return {
    alias: validateName(profileForm.alias, "alias"),
    name: validateName(profileForm.name, "name"),
    home_zip_code: validateZip(profileForm.home_zip_code, "home_zip_code"),
    jobs_per_day: validateJobsPerDay(profileForm.jobs_per_day, "jobs_per_day"),
    notes: validateNotes(profileForm.notes, "notes"),
  };
};
