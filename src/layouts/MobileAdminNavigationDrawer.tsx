import { Drawer } from "@mui/material";
import type { AdminNavigationLink } from "./model/adminNavigation";
import { useRef, useState } from "react";
import AdminNavigationLinks from "./AdminNavigationLinks";
import { destructiveGhostButton } from "../shared/styles/styles";

interface MobileAdminNavigationDrawerProps {
  links: AdminNavigationLink[];
  isSigningOut: boolean;
  onSignOut: () => void;
}

function MobileAdminNavigationDrawer({
  links,
  isSigningOut,
  onSignOut,
}: MobileAdminNavigationDrawerProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  const openDrawer = () => {
    triggerButtonRef.current?.blur();
    setIsDrawerOpen(true);
  };
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      <button
        ref={triggerButtonRef}
        type="button"
        onClick={openDrawer}
        aria-label="Open admin navigation"
        aria-expanded={isDrawerOpen}
        aria-controls={isDrawerOpen ? "mobile-admin-navigation" : undefined}
        className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 transition-[background-color,border-color,color,transform] hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-main-500 focus-visible:ring-offset-2 active:scale-95 dark:border-zinc-800 dark:bg-zinc-900/70 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus-visible:ring-offset-zinc-950"
      >
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 7h16M4 12h16M4 17h16"
          />
        </svg>
      </button>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={closeDrawer}
        slotProps={{
          transition: {
            onExited: () => triggerButtonRef.current?.focus(),
          },
          paper: {
            id: "mobile-admin-navigation",
            role: "dialog",
            "aria-modal": true,
            "aria-labelledby": "mobile-admin-navigation-title",
            className: "text-zinc-950 dark:text-zinc-50",
            sx: {
              width: "min(20rem, calc(100vw - 1rem))",
              borderLeft: 1,
              borderColor: "divider",
            },
          },
        }}
      >
        <div className="flex min-h-full flex-col">
          <div className="flex items-start justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
            <div>
              <h2
                id="mobile-admin-navigation-title"
                className="font-heading text-base font-semibold text-zinc-900 dark:text-zinc-50"
              >
                Admin panel
              </h2>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Management tools available to your role
              </p>
            </div>

            <button
              autoFocus
              type="button"
              onClick={closeDrawer}
              aria-label="Close admin navigation"
              className="-mr-2 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-main-500 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <nav aria-label="Admin navigation" className="flex-1 p-4">
            <AdminNavigationLinks
              links={links}
              variant="mobile"
              onNavigate={closeDrawer}
            />
          </nav>

          <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
            <button
              type="button"
              disabled={isSigningOut}
              onClick={onSignOut}
              className={`${destructiveGhostButton} min-h-11 w-full justify-start gap-2 px-3`}
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 17l5-5-5-5M15 12H3m9-8h6a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6"
                />
              </svg>
              {isSigningOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </div>
      </Drawer>
    </>
  );
}

export default MobileAdminNavigationDrawer;
