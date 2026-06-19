import type { Technician } from "../../../entities/technician/technician.types";

interface TechnicianCardProps {
  technician: Technician;
  zones: string[];
  isOpen: boolean;
  onToggle: () => void;
}

function ManageTechnicianCard({
  technician,
  zones,
  isOpen,
  onToggle,
}: TechnicianCardProps) {
  return (
    <div
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      tabIndex={0}
      className={`focus-visible:ring-main-500 cursor-pointer overflow-hidden rounded-xl border transition-[border-color,background-color,box-shadow] duration-200 focus-visible:ring-2 focus-visible:outline-none ${isOpen ? "border-main-500/40 bg-white shadow-md dark:bg-zinc-800/80" : "border-zinc-200 bg-white shadow-sm hover:border-zinc-300 hover:shadow-md dark:border-zinc-700/60 dark:bg-zinc-800/50 dark:hover:border-zinc-600"}`}
    >
      {/* --- Main Info, visible always --- */}
      <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3">
        {/* Avatar dot */}
        <span
          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${isOpen ? "bg-main-500 text-zinc-900" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"}`}
        >
          {technician.alias.charAt(0).toUpperCase()}
        </span>

        {/* Name and area info */}
        <div className="min-w-0">
          <p
            className={`font-heading text-base font-semibold transition-colors ${isOpen ? "text-main-500" : "text-zinc-800 dark:text-zinc-100"}`}
          >
            {technician.alias}
          </p>

          <div className="mt-0.5 text-xs text-zinc-400 dark:text-zinc-500">
            <p className="truncate">ZIP {technician.home_zip_code}</p>
            <p className="truncate">{zones.join(" - ")}</p>
          </div>
        </div>

        {/* Jobs/day badge */}
        <div className="flex items-center gap-3">
          {/* Chevron */}
          <svg
            className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* --- Expanded panel --- */}
      <div
        className={`overflow-hidden transition-all duration-200 ${isOpen ? "max-h-96" : "max-h-0"}`}
      >
        <div className="flex items-center justify-center p-2">
          <button className="bg-main-500 hover:bg-main-400 focus-visible:ring-main-500 cursor-pointer rounded-xl px-4 py-2.5 text-xs font-semibold text-zinc-950 transition-[background-color,transform] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]">
            Edit Technician
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManageTechnicianCard;
