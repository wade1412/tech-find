import type { AppRole } from "./user.types";

export const roleLabelMap: Record<AppRole, string> = {
  user: "User",
  secondary_admin: "Secondary Admin",
  main_admin: "Main Admin",
  owner: "Owner",
};

export const roleStyles: Record<AppRole, string> = {
  user: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  secondary_admin:
    "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  main_admin:
    "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
  owner: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
};
