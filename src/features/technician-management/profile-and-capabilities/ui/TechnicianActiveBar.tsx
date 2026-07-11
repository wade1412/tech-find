import { labelStyle } from "../model/profile.styles";
import ToggleStatus from "./ToggleStatus";

interface TechnicianActiveBarProps {
  isActive: boolean;
  isDisabled: boolean;
  toggleActive: () => void;
}

function TechnicianActiveBar({
  isActive,
  isDisabled,
  toggleActive,
}: TechnicianActiveBarProps) {
  return (
    <section
      className={`flex flex-col gap-3 rounded-xl border px-4 py-3 transition-colors sm:flex-row sm:items-center sm:justify-between ${isActive ? "border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-900/40" : "border-red-200 bg-red-50/60 dark:border-red-900/40 dark:bg-red-950/20"} `}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className={labelStyle}>Technician status</p>

          <span
            className={`rounded-lg px-2 py-0.5 text-[11px] font-semibold ${isActive ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-500" : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"} `}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          Inactive technicians are excluded from all matching results.
        </p>
      </div>

      <ToggleStatus
        checked={isActive}
        onChange={toggleActive}
        disabled={isDisabled}
      />
    </section>
  );
}

export default TechnicianActiveBar;
