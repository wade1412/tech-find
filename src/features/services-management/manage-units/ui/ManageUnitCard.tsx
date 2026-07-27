import { Link } from "react-router";
import type { Unit } from "../../../../entities/unit/unit.types";

interface ManageUnitCardProps {
  unit: Unit;
}

const getCapabilitySummary = (unit: Unit) => {
  const capabilities = [
    unit.can_be_commercial ? "Commercial" : null,
    unit.can_be_gas ? "Gas" : null,
    unit.can_be_stacked ? "Stacked" : null,
    unit.is_built_in ? "Built-in" : null,
  ].filter(Boolean);

  return capabilities.length > 0 ? capabilities.join(" · ") : "Standard unit";
};

function ManageUnitCard({ unit }: ManageUnitCardProps) {
  const isInactive = !unit.active;

  return (
    <Link
      to={`units/${unit.id}/edit`}
      className={`group block h-full overflow-hidden rounded-xl border transition-[border-color,background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950 ${
        isInactive
          ? "border-zinc-200/80 bg-zinc-50/80 hover:border-zinc-300 hover:bg-zinc-100/70 dark:border-zinc-800/80 dark:bg-zinc-900/40 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/60"
          : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/70 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
      }`}
    >
      <div className="grid min-h-24 grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3">
        <span
          aria-hidden="true"
          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
            isInactive
              ? "bg-zinc-200/70 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
          }`}
        >
          {unit.name.charAt(0).toUpperCase()}
        </span>

        <div className="min-w-0">
          <p
            className={`truncate font-heading text-base font-semibold transition-colors ${
              isInactive
                ? "text-zinc-600 dark:text-zinc-400"
                : "text-zinc-800 dark:text-zinc-100"
            }`}
          >
            {unit.name}
          </p>

          <div
            className={`mt-0.5 text-xs leading-5 ${
              isInactive
                ? "text-zinc-500/80 dark:text-zinc-500"
                : "text-zinc-500 dark:text-zinc-400"
            }`}
          >
            <p className="truncate">Filter order {unit.display_order}</p>
            <p className="truncate">{getCapabilitySummary(unit)}</p>
          </div>
        </div>

        {isInactive && (
          <span className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white/70 px-2.5 py-1 text-xs font-medium text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
            Inactive
          </span>
        )}
      </div>
    </Link>
  );
}

export default ManageUnitCard;
