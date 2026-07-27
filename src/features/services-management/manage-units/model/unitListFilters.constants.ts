export const UNIT_STATUS_FILTER_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
] as const;

export type UnitStatusFilterValue =
  (typeof UNIT_STATUS_FILTER_OPTIONS)[number]["value"];

export const isUnitStatusFilterValue = (
  value: string | null,
): value is UnitStatusFilterValue =>
  UNIT_STATUS_FILTER_OPTIONS.some((option) => option.value === value);
