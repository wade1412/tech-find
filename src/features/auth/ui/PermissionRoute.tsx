import type { ReactNode } from "react";
import type { AdminPermission } from "../model/auth.permissions";
import { useAuthPermissions } from "../model/useAuthPermissions";
import { Navigate } from "react-router";

function PermissionRoute({
  permission,
  children,
}: {
  permission: AdminPermission;
  children: ReactNode;
}) {
  const permissions = useAuthPermissions();

  if (!permissions[permission]) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PermissionRoute;
