import type {
  SpecificIssue,
  SpecificIssueInsert,
  SpecificIssueUpdate,
} from "../../../../entities/specific-issue/specific-issue.types";
import type { SpecificIssueFormState } from "./manage-specific-issues.types";

export const EMPTY_SPECIFIC_ISSUE_FORM_STATE: SpecificIssueFormState = {
  active: true,
  name: "",
  slug: "",
  unit_id: "",
};

export const createSpecificIssueFormState = (
  specificIssue: SpecificIssue,
): SpecificIssueFormState => ({
  active: specificIssue.active,
  name: specificIssue.name,
  slug: specificIssue.slug,
  unit_id: specificIssue.unit_id,
});

export const normalizeSpecificIssueFormState = (
  formState: SpecificIssueFormState,
): SpecificIssueInsert => ({
  active: formState.active,
  name: formState.name.trim(),
  slug: formState.slug.trim().toLowerCase(),
  unit_id: formState.unit_id,
});

export const buildSpecificIssuePatch = (
  specificIssue: SpecificIssue,
  formState: SpecificIssueFormState,
): SpecificIssueUpdate => {
  const normalized = normalizeSpecificIssueFormState(formState);
  const patch: SpecificIssueUpdate = {};

  for (const key of Object.keys(normalized) as (keyof SpecificIssueInsert)[]) {
    if (normalized[key] !== specificIssue[key]) {
      Object.assign(patch, { [key]: normalized[key] });
    }
  }

  return patch;
};

export const isNewSpecificIssueFormDirty = (
  formState: SpecificIssueFormState,
) => {
  const normalized = normalizeSpecificIssueFormState(formState);
  const initial = normalizeSpecificIssueFormState(
    EMPTY_SPECIFIC_ISSUE_FORM_STATE,
  );

  return Object.keys(normalized).some(
    (key) =>
      normalized[key as keyof SpecificIssueInsert] !==
      initial[key as keyof SpecificIssueInsert],
  );
};
