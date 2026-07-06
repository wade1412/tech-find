import { Link } from "react-router";
import type { Technician } from "../../../entities/technician/technician.types";

interface TechnicianCardProps {
  technician: Technician;
  zones: string[];
}

function ManageTechnicianCard({ technician, zones }: TechnicianCardProps) {
  return (
    <Link
      to={`${technician.id}/edit`}
      className="group block h-full overflow-hidden rounded-xl border border-zinc-200 bg-white transition-[border-color,background-color] duration-200 hover:border-zinc-300 hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-zinc-800 dark:bg-zinc-900/70 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 dark:focus-visible:ring-offset-zinc-950 "
    >
      {/* --- Main Info, visible always --- */}
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3">
        {/* Avatar dot */}
        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
          {technician.alias.charAt(0).toUpperCase()}
        </span>

        {/* Name and area info */}
        <div className="min-w-0">
          <p className="font-heading text-base font-semibold transition-colors text-zinc-800 dark:text-zinc-100">
            {technician.alias}
          </p>

          <div className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
            <p className="truncate">ZIP {technician.home_zip_code}</p>
            <p className="truncate">{zones.join(" - ")}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ManageTechnicianCard;
