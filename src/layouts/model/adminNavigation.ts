import type {
  AdminPermission,
  AuthPermissions,
} from "../../features/auth/model/auth.permissions";

export type AdminNavigationLink = {
  to: string;
  label: string;
};

const adminNavigationItems = [
  {
    permission: "canManageTechnicians",
    to: "/technicians",
    label: "Technicians",
  },
  {
    permission: "canManageUsers",
    to: "/users",
    label: "Users",
  },
  {
    permission: "canManageServices",
    to: "/services",
    label: "Services",
  },
] as const satisfies ReadonlyArray<{
  permission: AdminPermission;
  to: string;
  label: string;
}>;

export function getAdminNavigationLinksFromPermissions(
  permissions: AuthPermissions,
): AdminNavigationLink[] {
  return adminNavigationItems
    .filter(({ permission }) => permissions[permission] === true)
    .map(({ to, label }) => ({ to, label }));
}
