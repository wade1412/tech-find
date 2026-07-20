export const MANAGE_USERS_LIST_FILTER_OPTIONS = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
] as const;

export type ManageUsersListFilterValue =
  (typeof MANAGE_USERS_LIST_FILTER_OPTIONS)[number]["value"];

export const isManageUsersListFilterValue = (
  value: string | null,
): value is ManageUsersListFilterValue =>
  MANAGE_USERS_LIST_FILTER_OPTIONS.some((option) => option.value === value);
