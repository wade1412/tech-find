import type { AppRole } from "./user.types";

export const ROLE_LEVEL: Record<AppRole, number> = {
  user: 0,
  secondary_admin: 1,
  main_admin: 2,
  owner: 3,
};

export const USER_ROLE_OPTIONS = [
  { value: "user", label: "User" },
  { value: "secondary_admin", label: "Secondary Admin" },
  { value: "main_admin", label: "Main Admin" },
  { value: "owner", label: "Owner" },
] as const satisfies ReadonlyArray<{ value: AppRole; label: string }>;

export const roleLabelMap = Object.fromEntries(
  USER_ROLE_OPTIONS.map(({ value, label }) => [value, label]),
) as Record<AppRole, string>;

export const roleStyles: Record<AppRole, string> = {
  user: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  secondary_admin:
    "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  main_admin:
    "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
  owner: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
};
