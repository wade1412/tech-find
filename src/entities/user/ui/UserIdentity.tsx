import type { AppRole } from "../user.types";
import UserRoleBadge from "./UserRoleBadge";

interface UserIdentityProps {
  workName: string;
  realName: string;
  role: AppRole;
  variant: "desktop" | "mobile";
}

function UserIdentity({
  workName,
  realName,
  role,
  variant,
}: UserIdentityProps) {
  const isMobile = variant === "mobile";

  return (
    <div
      className={`flex min-w-0 flex-col gap-1 ${isMobile ? "items-center text-center" : "items-end"}`}
    >
      <div
        className={`flex min-w-0 flex-col gap-px ${isMobile ? "items-center" : "items-end"}`}
      >
        <span className="max-w-full truncate text-sm leading-none font-semibold text-zinc-900 dark:text-zinc-100">
          {workName}
        </span>

        {realName && (
          <span
            className={`max-w-full truncate text-[11px] font-medium text-zinc-400 dark:text-zinc-500 ${isMobile ? "hidden min-[30rem]:block" : "max-w-37.5"}`}
          >
            {realName}
          </span>
        )}
      </div>

      <UserRoleBadge role={role} />
    </div>
  );
}

export default UserIdentity;
