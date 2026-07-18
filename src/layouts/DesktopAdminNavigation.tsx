import type { AdminNavigationLink } from "./model/adminNavigation";
import AdminNavigationLinks from "./AdminNavigationLinks";

interface DesktopAdminNavigationProps {
  links: AdminNavigationLink[];
}

function DesktopAdminNavigation({
  links,
}: DesktopAdminNavigationProps) {
  return (
    <nav aria-label="Admin navigation">
      <AdminNavigationLinks links={links} variant="desktop" />
    </nav>
  );
}

export default DesktopAdminNavigation;
