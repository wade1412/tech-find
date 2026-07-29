export const SERVICE_STATUS_FILTER_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
] as const;

export type ServiceStatusFilterValue =
  (typeof SERVICE_STATUS_FILTER_OPTIONS)[number]["value"];

export const isServiceStatusFilterValue = (
  value: string | null,
): value is ServiceStatusFilterValue =>
  SERVICE_STATUS_FILTER_OPTIONS.some((option) => option.value === value);
