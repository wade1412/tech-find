export const USER_STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
] as const;

export type UserStatusFilterValue =
  (typeof USER_STATUS_FILTER_OPTIONS)[number]["value"];

export const isUserStatusFilterValue = (
  value: string | null,
): value is UserStatusFilterValue =>
  USER_STATUS_FILTER_OPTIONS.some((option) => option.value === value);
