import type { AppRole, User } from "../../../entities/user/user.types";

export function getUsersVisibleToRole(
  users: readonly User[],
  viewerRole: AppRole | null,
): User[] {
  if (viewerRole === "owner") return [...users];

  return users.filter((user) => user.role !== "owner");
}

export function putCurrentUserFirst(
  users: readonly User[],
  currentUserId?: string,
): User[] {
  if (!currentUserId) return [...users];

  return [...users].sort((left, right) => {
    if (left.id === currentUserId) return -1;
    if (right.id === currentUserId) return 1;
    return 0;
  });
}
