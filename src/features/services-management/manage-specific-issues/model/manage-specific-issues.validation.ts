import type { Unit } from "../../../../entities/unit/unit.types";
import { SLUG_PATTERN } from "../../model/manageServices.constants";
import type {
  SpecificIssueFormErrors,
  SpecificIssueFormState,
} from "./manage-specific-issues.types";

export const validateSpecificIssueForm = (
  formState: SpecificIssueFormState,
  units: readonly Unit[],
): SpecificIssueFormErrors => {
  const name = formState.name.trim();
  const slug = formState.slug.trim().toLowerCase();
  const selectedUnit = units.find((unit) => unit.id === formState.unit_id);

  return {
    name: !name
      ? "Name cannot be empty"
      : name.length > 80
        ? "Name cannot be longer than 80 characters"
        : undefined,
    slug: !slug
      ? "Slug cannot be empty"
      : slug.length > 64
        ? "Slug cannot be longer than 64 characters"
        : !SLUG_PATTERN.test(slug)
          ? "Use lowercase letters, numbers, and single hyphens"
          : undefined,
    unit_id: !formState.unit_id
      ? "Select a unit"
      : !selectedUnit
        ? "The selected unit is no longer available"
        : selectedUnit.archived_at
          ? "Archived units cannot be selected"
          : undefined,
  };
};

type DatabaseError = Error & {
  code?: string;
  constraint?: string;
  details?: string;
};

export const getSpecificIssueSaveErrorMessage = (error: Error | null) => {
  if (!error) return undefined;

  const databaseError = error as DatabaseError;
  if (databaseError.code !== "23505") return error.message;

  const constraintText =
    `${databaseError.constraint ?? ""} ${databaseError.details ?? ""}`.toLowerCase();

  if (
    constraintText.includes("specific_issue_name") ||
    constraintText.includes("key (name)")
  ) {
    return "A specific issue with this name already exists.";
  }

  if (
    constraintText.includes("specific_issue_slug") ||
    constraintText.includes("key (slug)")
  ) {
    return "A specific issue with this slug already exists.";
  }

  return "A specific issue with this name or slug already exists.";
};
