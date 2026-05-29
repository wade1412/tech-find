import type { Technician } from "../technician.types";

interface TechnicianCardProps {
  technician: Technician;
  isOpen: boolean;
  onToggle: () => void;
}

function TechnicianCard({ technician, isOpen, onToggle }: TechnicianCardProps) {
  const specificSkills = [
    technician.gas && "Gas",
    technician.can_service_built_in && "Built-In",
    technician.can_service_stacked_dryer && "Stacked Dryer",
    technician.can_service_stacked_washer && "Stacked Washer",
    technician.commercial && "Commercial",
  ].filter(Boolean) as string[];

  return (
    <div
      onClick={onToggle}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onToggle();
      }}
      className={`cursor-pointer overflow-hidden rounded-xl border transition-[border-color,background-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-500
        ${
          isOpen
            ? "border-main-500/40 bg-white shadow-md dark:bg-zinc-800/80"
            : "border-zinc-200 bg-white shadow-sm hover:border-zinc-300 hover:shadow-md dark:border-zinc-700/60 dark:bg-zinc-800/50 dark:hover:border-zinc-600"
        }`}
    >
      {/* Main Info, visible always */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {/* Avatar dot */}
          <span
            className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors
            ${isOpen ? "bg-main-500 text-zinc-900" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"}`}
          >
            {technician.alias.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <p
            className={`font-heading text-base font-semibold transition-colors ${isOpen ? "text-main-500" : "text-zinc-800 dark:text-zinc-100"}`}
          >
            {technician.alias}
          </p>

          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            ZIP {technician.home_zip_code}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="min-w-[12ch] text-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
            {technician.jobs_per_day} jobs/day
          </span>
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

      {/* Expanded panel */}
      <div
        className={`overflow-hidden transition-all duration-200 ${isOpen ? "max-h-96" : "max-h-0"}`}
      >
        <div className="border-t border-zinc-100 px-4 py-3 dark:border-zinc-700/60">
          {specificSkills.length > 0 ? (
            <div className="mb-2.5">
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Specific skills:
              </p>

              <div className="flex flex-wrap gap-1.5">
                {specificSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md bg-main-500/10 px-3 py-0.5 text-sm font-light text-main-500"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              No specific skills
            </p>
          )}

          {technician.notes && (
            <div className="mt-2">
              <p className="text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                Notes
              </p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {technician.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TechnicianCard;
