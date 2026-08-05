import type { AppRole } from "../../../entities/user/user.types";

export const EDITABLE_USER_KEYS = [
  "active",
  "alias",
  "email",
  "full_name",
  "role",
] as const;

export const MAIN_ADMIN_ASSIGNABLE_ROLES: AppRole[] = [
  "user",
  "secondary_admin",
];
