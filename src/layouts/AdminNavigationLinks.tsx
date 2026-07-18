import { NavLink } from "react-router";
import type { AdminNavigationLink } from "./model/adminNavigation";

interface AdminNavigationLinksProps {
  links: AdminNavigationLink[];
  variant: "desktop" | "mobile";
  onNavigate?: () => void;
}

const desktopLinkBase =
  "inline-flex min-h-9 items-center rounded-lg border px-2.5 py-1 text-sm font-medium transition-[background-color,border-color,color,transform] duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-main-500 focus-visible:ring-offset-2 active:scale-[0.97] dark:focus-visible:ring-offset-zinc-950";

const mobileLinkBase =
  "group flex min-h-12 items-center justify-between rounded-xl border px-4 py-3 text-sm font-semibold transition-[background-color,border-color,color,transform] duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-main-500 focus-visible:ring-offset-2 active:scale-[0.99] dark:focus-visible:ring-offset-zinc-950";

function AdminNavigationLinks({
  links,
  variant,
  onNavigate,
}: AdminNavigationLinksProps) {
  const isDesktop = variant === "desktop";

  return (
    <ul className={isDesktop ? "flex items-center gap-1.5" : "space-y-2"}>
      {links.map(({ to, label }) => (
        <li key={to}>
          <NavLink
            to={to}
            onClick={onNavigate}
            className={({ isActive }) => {
              const base = isDesktop ? desktopLinkBase : mobileLinkBase;
              const active = isDesktop
                ? "border-main-500/40 bg-main-500/10 text-main-500 dark:text-main-400"
                : "border-main-500/40 bg-main-500/10 text-main-500 dark:bg-main-500/10 dark:text-main-400";
              const inactive = isDesktop
                ? "border-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-50";

              return `${base} ${isActive ? active : inactive}`;
            }}
          >
            <span>{label}</span>
            {!isDesktop && (
              <svg
                aria-hidden="true"
                className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-0.5 dark:text-zinc-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9 18 6-6-6-6"
                />
              </svg>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export default AdminNavigationLinks;
