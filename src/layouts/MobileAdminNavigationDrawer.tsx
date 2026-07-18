import { Drawer } from "@mui/material";
import type { PanelLink } from "./model/adminNavitagion";
import { useState } from "react";
import { NavLink } from "react-router";

interface MobileAdminNavigationDrawerProps {
  panelLinks: PanelLink[];
}

function MobileAdminNavigationDrawer({
  panelLinks,
}: MobileAdminNavigationDrawerProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawerOpen = () => setIsDrawerOpen((prev) => !prev);

  return (
    <div>
      <button onClick={toggleDrawerOpen}>Open</button>
      <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawerOpen}>
        {panelLinks.map(({ hasPermission, linkTo, label }) => {
          if (!hasPermission) return null;

          return (
            <NavLink
              to={linkTo}
              key={linkTo}
              className={({
                isActive,
              }) => `active:scale-95 cursor-pointer rounded-lg px-2.5 py-1 text-sm transition-all duration-150 border-2
                ${
                  isActive
                    ? "border-main-500/40 bg-main-500/10 text-main-500"
                    : "border-transparent bg-white text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:bg-transparent dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                }`}
            >
              {label}
            </NavLink>
          );
        })}
      </Drawer>
    </div>
  );
}

export default MobileAdminNavigationDrawer;
