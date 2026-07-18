import type { AuthPermissions } from "../features/auth/model/auth.permissions";
import { getAdminNavigationLinksFromPermissions } from "./model/adminNavigation";
import { useMediaQuery } from "react-responsive";
import { ADMIN_NAVIGATION_BREAKPOINT } from "../shared/model/responsive.constants";
import MobileAdminNavigationDrawer from "./MobileAdminNavigationDrawer";
import DesktopAdminNavigation from "./DesktopAdminNavigation";

function AdminNavigation({ permissions }: { permissions: AuthPermissions }) {
  const links = getAdminNavigationLinksFromPermissions(permissions);
  const isDesktopMode = useMediaQuery({
    query: `(min-width: ${ADMIN_NAVIGATION_BREAKPOINT})`,
  });

  if (links.length === 0) return null;

  return isDesktopMode ? (
    <DesktopAdminNavigation links={links} />
  ) : (
    <MobileAdminNavigationDrawer links={links} />
  );
}

export default AdminNavigation;
