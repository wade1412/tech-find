import type { UserProfile } from "./auth.types";
import type { AppRole } from "../../../entities/user/user.types";
import { ROLE_LEVEL } from "../../../entities/user/roles.constants";

export type { AppRole } from "../../../entities/user/user.types";
export { ROLE_LEVEL } from "../../../entities/user/roles.constants";

export interface AuthPermissions {
  role: AppRole | null;
  roleLevel: number;

  canViewApp: boolean;
  canViewAdminPanel: boolean;

  canManageTechnicians: boolean;
  canArchiveTechnicians: boolean;
  canPurgeTechnicians: boolean;
  canManageUsers: boolean;
  canManageServices: boolean;
  canArchiveServices: boolean;
  canPurgeServices: boolean;
}

export type AdminPermission =
  | "canManageTechnicians"
  | "canArchiveTechnicians"
  | "canPurgeTechnicians"
  | "canManageUsers"
  | "canManageServices"
  | "canArchiveServices"
  | "canPurgeServices";

type PermissionProfile = Pick<UserProfile, "role" | "active">;

export function isAppRole(role: unknown): role is AppRole {
  return (
    typeof role === "string" &&
    Object.prototype.hasOwnProperty.call(ROLE_LEVEL, role)
  );
}

export function getRoleLevel(role: unknown): number {
  if (!isAppRole(role)) {
    return -1;
  }

  return ROLE_LEVEL[role];
}

export function hasRoleLevelOf(role: unknown, minimumRole: AppRole): boolean {
  return getRoleLevel(role) >= ROLE_LEVEL[minimumRole];
}

export function isAllowedRole(
  role: unknown,
  allowedRoles: readonly AppRole[],
): boolean {
  return isAppRole(role) && allowedRoles.includes(role);
}

export function getAuthPermissions(
  profile: PermissionProfile | null | undefined,
): AuthPermissions {
  const isActive = Boolean(profile?.active);
  const role = isActive && isAppRole(profile?.role) ? profile.role : null;
  const roleLevel = getRoleLevel(role);

  return {
    role,
    roleLevel,

    canViewApp: isActive,

    canViewAdminPanel: hasRoleLevelOf(role, "secondary_admin"),
    canManageTechnicians: hasRoleLevelOf(role, "secondary_admin"),
    canArchiveTechnicians: hasRoleLevelOf(role, "main_admin"),
    canPurgeTechnicians: role === "owner",

    canManageUsers: hasRoleLevelOf(role, "main_admin"),
    canManageServices: hasRoleLevelOf(role, "main_admin"),
    canArchiveServices: hasRoleLevelOf(role, "main_admin"),
    canPurgeServices: role === "owner",
  };
}
