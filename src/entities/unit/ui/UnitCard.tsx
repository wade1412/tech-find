import type { Unit } from "../unit.types";

interface UnitCardProps {
  unit: Unit;
  isSelected: boolean;
  onToggle: () => void;
}

function UnitCard({ unit, isSelected, onToggle }: UnitCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onToggle();
      }}
      onClick={onToggle}
      className={`relative flex h-18 cursor-pointer items-center justify-center overflow-hidden rounded-xl p-3 text-center transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-500
        ${
          isSelected
            ? "border-2 border-main-500 bg-main-500/10 text-main-500 shadow-inner dark:bg-main-500/10"
            : "border border-zinc-200 bg-white text-zinc-700 shadow-sm hover:border-zinc-300 hover:shadow-md dark:border-zinc-700/60 dark:bg-zinc-800/50 dark:text-zinc-200 dark:hover:border-zinc-600"
        }
        `}
    >
      {isSelected && (
        <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-main-500">
          <svg
            className="h-2.5 w-2.5 text-zinc-900"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </span>
      )}
      <span className="font-heading text-sm font-semibold leading-tight">
        {unit.name}
      </span>
    </div>
  );
}

export default UnitCard;
