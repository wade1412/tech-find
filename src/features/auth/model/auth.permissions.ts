import type { UserProfile } from "./auth.types";

export const ROLE_LEVEL = {
  user: 0,
  secondary_admin: 1,
  main_admin: 2,
  owner: 3,
};

export type AppRole = keyof typeof ROLE_LEVEL;

export interface AuthPermissions {
  role: AppRole | null;
  roleLevel: number;

  canViewApp: boolean;
  canViewAdminPanel: boolean;

  canManageTechnicians: boolean;
  canManageUsers: boolean;
  canManageReferenceData: boolean;

  canUseOwnerTools: boolean;
}

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

    canManageUsers: hasRoleLevelOf(role, "main_admin"),
    canManageReferenceData: hasRoleLevelOf(role, "main_admin"),

    canUseOwnerTools: role === "owner",
  };
}
