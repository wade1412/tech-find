import type { ReactNode } from "react";
import type { AdminPermission } from "../model/auth.permissions";
import { useAuthPermissions } from "../model/useAuthPermissions";
import AccessDeniedPage from "../../../pages/AccessDeniedPage";

function PermissionRoute({
  permission,
  children,
}: {
  permission: AdminPermission;
  children: ReactNode;
}) {
  const permissions = useAuthPermissions();

  if (!permissions[permission]) {
    return <AccessDeniedPage />;
  }

  return children;
}

export default PermissionRoute;
