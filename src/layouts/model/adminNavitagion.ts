import type { AuthPermissions } from "../../features/auth/model/auth.permissions";

export type PanelLink = {
  linkTo: string;
  label: string;
  hasPermission: boolean;
};

const panelNames = [
  {
    hasPermissionKey: "canManageTechnicians",
    linkTo: "/technicians",
    label: "Technicians",
  },
  {
    hasPermissionKey: "canManageUsers",
    linkTo: "/users",
    label: "Users",
  },
  {
    hasPermissionKey: "canManageServices",
    linkTo: "/services",
    label: "Services",
  },
  {
    hasPermissionKey: "canUseOwnerTools",
    linkTo: "/owner",
    label: "Owner Tools",
  },
] as const;

export const getAdminNavigationLinksFromPermissions = (
  permissions: AuthPermissions,
): PanelLink[] =>
  panelNames.map((panel) => ({
    linkTo: panel.linkTo,
    label: panel.label,
    hasPermission: permissions[panel.hasPermissionKey],
  }));
