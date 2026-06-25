import { NavLink } from "react-router";
import type { AuthPermissions } from "../features/auth/model/auth.permissions";

function AdminPanel({ permissions }: { permissions: AuthPermissions }) {
  const panelLinks = [
    {
      hasPermission: permissions.canManageTechnicians,
      linkTo: "/technicians",
      label: "Technicians",
    },
    {
      hasPermission: permissions.canManageUsers,
      linkTo: "/users",
      label: "Users",
    },
    {
      hasPermission: permissions.canManageServices,
      linkTo: "/services",
      label: "Services",
    },
    {
      hasPermission: permissions.canUseOwnerTools,
      linkTo: "/owner",
      label: "Owner Tools",
    },
  ];

  return (
    <div className="flex gap-2">
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
    </div>
  );
}

export default AdminPanel;
