import { Link, useNavigate } from "react-router";
import { useTheme } from "../features/theme/useTheme";
import logoLight from "../shared/assets/techfind-logo-light.svg";
import logoDark from "../shared/assets/techfind-logo-dark.svg";
import ThemeToggle from "../features/theme/ThemeToggle";
import { useAuth } from "../features/auth/model/AuthContext";
import { useState } from "react";
import { useAuthPermissions } from "../features/auth/model/useAuthPermissions";
import AdminPanel from "./AdminPanel";
import type { AppRole } from "../features/auth/model/auth.permissions";

const roleLabelMap: Record<AppRole, string> = {
  user: "User",
  secondary_admin: "Secondary Admin",
  main_admin: "Main Admin",
  owner: "Owner",
};

const roleStyles = {
  user: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  secondary_admin:
    "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  main_admin:
    "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400",
  owner: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
};

function Header() {
  const { theme } = useTheme();
  const logoSource = theme === "dark" ? logoDark : logoLight;

  const [isSigningOut, setIsSigningOut] = useState(false);

  const { profile, signOut } = useAuth();
  const permissions = useAuthPermissions();
  const navigate = useNavigate();

  const workName =
    profile?.alias || profile?.full_name || profile?.email || "User";
  const realName =
    profile?.full_name !== profile?.alias ? profile?.full_name : "";
  const role = permissions.role || "user";
  const roleLabel = roleLabelMap[role];

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
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        {/* Left: Logo And Name */}
        <Link to="/" className="group flex items-center gap-2.5">
          <img
            src={logoSource}
            alt=""
            aria-hidden="true"
            className="h-10 w-10 transition-transform duration-200 group-hover:scale-105"
          />
          <h2 className="font-heading text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            TechFind
          </h2>
        </Link>

        {/* Admin Panel: Rendered only with permissions */}
        {permissions.canViewAdminPanel && (
          <AdminPanel permissions={permissions} />
        )}

        {/* Right: Action Panel */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {/* Vertical Divider */}
          <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700" />

          {/* User Profile */}
          <div className="hidden flex-col items-end gap-1 sm:flex">
            <div className="flex flex-col gap-px items-end">
              <span className="text-sm leading-none font-semibold text-zinc-900 dark:text-zinc-100">
                {workName}
              </span>

              {realName && (
                <span className="max-w-37.5 truncate text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                  {realName}
                </span>
              )}
            </div>

            <span
              className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase ${roleStyles[role]}`}
            >
              {roleLabel}
            </span>
          </div>

          {/* Sign Out Button */}
          <button
            type="button"
            disabled={isSigningOut}
            onClick={handleSignOut}
            className="cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-500 transition-[color,opacity] duration-200 enabled:hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2  dark:text-zinc-400 enabled:dark:hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSigningOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
