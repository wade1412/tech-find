import { Navigate, useLocation } from "react-router";
import { useAuth } from "../model/AuthContext";
import { FullPageSpinner } from "../../../shared/ui/Spinners";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const {
    session,
    authError,
    retryProfile,
    isLoading,
    isAuthenticated,
    isProfileLoading,
  } = useAuth();

  const location = useLocation();

  if (session && authError?.code === "profile_request_failed") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
        <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 text-center shadow-lg dark:border-zinc-800 dark:bg-zinc-900/50">
          <h1 className="text-lg font-semibold">Profile loading failed</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            {authError.message}
          </p>

          <button
            type="button"
            onClick={() => void retryProfile()}
            className="bg-main-500 hover:bg-main-400 focus-visible:ring-main-500 mt-4 cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-[background-color, transform] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || isProfileLoading) {
    return <FullPageSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
