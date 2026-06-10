import { Navigate, useLocation } from "react-router";
import { useAuth } from "../model/AuthContext";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-zinc-200 border-t-main-500 dark:border-zinc-700 dark:border-t-main-400" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
