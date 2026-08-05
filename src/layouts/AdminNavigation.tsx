import type { AuthPermissions } from "../features/auth/model/auth.permissions";
import { getAdminNavigationLinksFromPermissions } from "./model/adminNavigation";
import MobileAdminNavigationDrawer from "./MobileAdminNavigationDrawer";
import DesktopAdminNavigation from "./DesktopAdminNavigation";

type AdminNavigationProps =
  | {
      permissions: AuthPermissions;
      variant: "desktop";
    }
  | {
      permissions: AuthPermissions;
      variant: "mobile";
      isSigningOut: boolean;
      onSignOut: () => void;
    };

function AdminNavigation(props: AdminNavigationProps) {
  const { permissions, variant } = props;
  const links = getAdminNavigationLinksFromPermissions(permissions);

  if (links.length === 0) return null;

  return variant === "desktop" ? (
    <DesktopAdminNavigation links={links} />
  ) : (
    <MobileAdminNavigationDrawer
      links={links}
      isSigningOut={props.isSigningOut}
      onSignOut={props.onSignOut}
    />
  );
}

export default AdminNavigation;
