export interface SpecificIssueFormState {
  active: boolean;
  name: string;
  slug: string;
  unit_id: string;
}

export type SpecificIssueFormErrors = Partial<
  Record<keyof SpecificIssueFormState, string>
>;

export type EditableSpecificIssueField = Exclude<
  keyof SpecificIssueFormState,
  "active"
>;
