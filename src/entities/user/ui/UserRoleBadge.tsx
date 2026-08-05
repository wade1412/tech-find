import type { AppRole } from "../user.types";
import { roleLabelMap, roleStyles } from "../roles.constants";

interface UserRoleBadgeProps {
  role: AppRole;
}

function UserRoleBadge({ role }: UserRoleBadgeProps) {
  return (
    <span
      className={`inline-flex max-w-full items-center truncate rounded-md px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase ${roleStyles[role]}`}
    >
      {roleLabelMap[role]}
    </span>
  );
}

export default UserRoleBadge;
