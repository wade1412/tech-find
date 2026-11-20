import { AnimatePresence, motion } from "motion/react";
import type { Unit } from "../unit.types";
import { heightRevealMotionProps } from "../../../shared/styles/motionVariants";

interface UnitCardProps {
  unit: Unit;
  isSelected: boolean;
  disabled?: boolean;
  unsupportedLabels?: string[];
  onToggle: () => void;
}

const selectedBase = "bg-main-500/10 shadow-inner";
const selectedStyle = `${selectedBase} border-2 border-main-500 text-main-500`;
const selectedConflictStyle = `${selectedBase} border-2 border-main-500/50 border-dashed text-main-500/80`;
const unselectedStyle =
  "border-2 border-zinc-200 bg-white text-zinc-700 shadow-sm enabled:hover:border-zinc-300 enabled:hover:shadow-md dark:border-zinc-700/60 dark:bg-zinc-800/50 dark:text-zinc-200 dark:enabled:hover:border-zinc-600";

function UnitCard({
  unit,
  isSelected,
  disabled = false,
  unsupportedLabels = [],
  onToggle,
}: UnitCardProps) {
  const hasConflicts = isSelected && unsupportedLabels.length > 0;
  const stateStyle = !isSelected
    ? unselectedStyle
    : hasConflicts
      ? selectedConflictStyle
      : selectedStyle;

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      disabled={disabled}
      onClick={onToggle}
      className={`relative flex h-20 w-full cursor-pointer flex-col items-center justify-center rounded-xl p-2 text-center transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-500 enabled:active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 overflow-hidden ${stateStyle}`}
    >
      {isSelected && (
        <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full ">
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

      {/* Caption that explains the conflict if its present */}
      <AnimatePresence initial={false}>
        {hasConflicts && (
          <motion.span
            key="conflict-caption"
            className="block overflow-hidden"
            {...heightRevealMotionProps}
          >
            <span className="block pt-0.75 pb-px text-[10px] font-medium leading-none text-zinc-500 dark:text-zinc-400">
              Not {unsupportedLabels.join(", ")}
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

export default UnitCard;
