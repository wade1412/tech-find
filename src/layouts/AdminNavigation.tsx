import type { AuthPermissions } from "../features/auth/model/auth.permissions";
import { getAdminNavigationLinksFromPermissions } from "./model/adminNavitagion";
import { useMediaQuery } from "react-responsive";
import { DESKTOP_BREAKPOINT } from "../shared/model/responsive.constants";
import MobileAdminNavigationDrawer from "./MobileAdminNavigationDrawer";
import DesktopAdminNavigation from "./DesktopAdminNavigation";

function AdminNavigation({ permissions }: { permissions: AuthPermissions }) {
  const panelLinks = getAdminNavigationLinksFromPermissions(permissions);
  const isDesktopMode = useMediaQuery({
    query: `(min-width: ${DESKTOP_BREAKPOINT})`,
  });

  return (
    <>
      {isDesktopMode ? (
        <DesktopAdminNavigation panelLinks={panelLinks} />
      ) : (
        <MobileAdminNavigationDrawer panelLinks={panelLinks} />
      )}
    </>
  );
}

export default AdminNavigation;
