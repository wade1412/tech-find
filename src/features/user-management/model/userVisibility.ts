import type { AppRole, User } from "../../../entities/user/user.types";

export function getUsersVisibleToRole(
  users: readonly User[],
  viewerRole: AppRole | null,
): User[] {
  if (viewerRole === "owner") return [...users];

  return users.filter((user) => user.role !== "owner");
}
