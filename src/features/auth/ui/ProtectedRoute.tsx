import { Navigate, useLocation } from "react-router";
import { useAuth } from "../model/AuthContext";
import { FullPageSpinner } from "../../../shared/ui/Spinners";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated, isProfileLoading } = useAuth();
  const location = useLocation();

  if (isLoading || isProfileLoading) {
    return <FullPageSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
