import { Link, useNavigate } from "react-router";
import { useTheme } from "../features/theme/useTheme";
import logoLight from "../shared/assets/techfind-logo-light.svg";
import logoDark from "../shared/assets/techfind-logo-dark.svg";
import ThemeToggle from "../features/theme/ThemeToggle";
import { useAuth } from "../features/auth/model/AuthContext";
import { useState } from "react";
import { useAuthPermissions } from "../features/auth/model/useAuthPermissions";
import AdminNavigation from "./AdminNavigation";
import { destructiveGhostButton } from "../shared/styles/styles";
import { useMediaQuery } from "react-responsive";
import { ADMIN_NAVIGATION_BREAKPOINT } from "../shared/model/responsive.constants";
import UserIdentity from "../entities/user/ui/UserIdentity";

function Header() {
  const { theme } = useTheme();
  const logoSource = theme === "dark" ? logoDark : logoLight;

  const [isSigningOut, setIsSigningOut] = useState(false);

  const { profile, signOut } = useAuth();
  const permissions = useAuthPermissions();
  const navigate = useNavigate();
  const isDesktopHeader = useMediaQuery({
    query: `(min-width: ${ADMIN_NAVIGATION_BREAKPOINT})`,
  });

  const workName = profile?.alias || "User";
  const realName =
    profile?.full_name && profile.full_name !== profile.alias
      ? profile.full_name
      : "";
  const role = permissions.role || "user";

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);

    try {
      await signOut();
      navigate("/login", { replace: true });
    } catch {
      navigate("/login", { replace: true });
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-zinc-50/80 backdrop-blur-sm transition-colors dark:border-zinc-800 dark:bg-zinc-950/80">
      <div
        className={`mx-auto max-w-6xl items-center px-4 py-3 md:px-6 ${isDesktopHeader ? "flex justify-between" : "grid grid-cols-[auto_minmax(0,1fr)_auto_auto] gap-2"}`}
      >
        {/* Left: Logo And Name */}
        <Link to="/" className="group flex items-center gap-2.5">
          <img
            src={logoSource}
            alt=""
            aria-hidden="true"
            className="h-10 w-10 transition-transform duration-200 group-hover:scale-105"
          />
          <span className="sr-only font-heading text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:not-sr-only">
            TechFind
          </span>
        </Link>

        {isDesktopHeader ? (
          <>
            {permissions.canViewAdminPanel && (
              <AdminNavigation permissions={permissions} variant="desktop" />
            )}

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700" />
              <UserIdentity
                workName={workName}
                realName={realName}
                role={role}
                variant="desktop"
              />
              <button
                type="button"
                disabled={isSigningOut}
                onClick={handleSignOut}
                className={destructiveGhostButton}
              >
                {isSigningOut ? "Signing out..." : "Sign out"}
              </button>
            </div>
          </>
        ) : (
          <>
            <UserIdentity
              workName={workName}
              realName={realName}
              role={role}
              variant="mobile"
            />
            <ThemeToggle />

            {permissions.canViewAdminPanel ? (
              <AdminNavigation
                permissions={permissions}
                variant="mobile"
                isSigningOut={isSigningOut}
                onSignOut={handleSignOut}
              />
            ) : (
              <button
                type="button"
                disabled={isSigningOut}
                onClick={handleSignOut}
                className={`${destructiveGhostButton} px-2 sm:px-4`}
              >
                {isSigningOut ? "Signing out..." : "Sign out"}
              </button>
            )}
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
