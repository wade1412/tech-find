import { useMemo } from "react";
import { useAuth } from "./AuthContext";
import { getAuthPermissions } from "./auth.permissions";

export function useAuthPermissions() {
  const { profile } = useAuth();

  return useMemo(() => getAuthPermissions(profile), [profile]);
}
