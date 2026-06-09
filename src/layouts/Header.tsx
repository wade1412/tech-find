import { Link, useNavigate } from "react-router";
import ThemeToggle from "../features/theme/ThemeToggle";
import { useAuth } from "../features/auth/model/AuthContext";

interface HeaderProps {
  logoSource: string;
}

const roleLabelMap = {
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

function Header({ logoSource }: HeaderProps) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const workName =
    profile?.alias || profile?.full_name || profile?.email || "User";
  const realName =
    profile?.full_name !== profile?.alias ? profile?.full_name : "";
  const role = profile?.role || "user";
  const roleLabel = roleLabelMap[role];

  const handleSignOut = async () => {
    await signOut();
    navigate("/login", { replace: true });
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

        {/* Right: Action Panel */}
        <div className="flex items-center gap-4">
          <ThemeToggle />

          {/* Vertical Divider */}
          <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-500" />

          {/* User Profile */}
          <div className="hidden flex-col items-end gap-0.5 sm:flex">
            <span className="text-sm leading-none font-semibold text-zinc-900 dark:text-zinc-100">
              {workName}
            </span>
            {realName && (
              <span className="max-w-37.5 truncate text-[11px] font-medium text-zinc-400 dark:text-zinc-500">
                {realName}
              </span>
            )}
            <span
              className={`mt-1 inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase ${roleStyles[role]}`}
            >
              {roleLabel}
            </span>
          </div>

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={handleSignOut}
            className="cursor-pointer rounded-lg border border-zinc-200 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-red-900/50 dark:hover:bg-red-950/30 dark:hover:text-red-400"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
