import { useTechnicianFilters } from "../model/useTechnicianFilters";
import { useMediaQuery } from "react-responsive";
import { DESKTOP_BREAKPOINT } from "../../../shared/model/responsive.constants";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { filtersRevealMotionProps } from "../../../shared/styles/motionVariants";
import FilterFields from "./FilterFields";

const activeFiltersBadgeMotionProps = {
  initial: { width: 0, opacity: 0 },
  animate: { width: "auto", opacity: 1 },
  exit: { width: 0, opacity: 0 },
  transition: { duration: 0.18, ease: "easeOut" },
} as const;

function FilterPanel() {
  const { filter, resetFilters } = useTechnicianFilters();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const isDesktopMode = useMediaQuery({
    query: `(min-width: ${DESKTOP_BREAKPOINT})`,
  });

  const activeFilterGroupsCount = [
    filter.zone,
    filter.unitSlugs.length,
    filter.brandSlugs.length,
    filter.specificIssueSlugs.length,
    filter.isGas,
    filter.isStacked,
    filter.isCommercial,
  ].filter(Boolean).length;

  const hasAnyFilter = activeFilterGroupsCount > 0;

  const toggleFiltersOpen = () => setIsFiltersOpen((prev) => !prev);

  return (
    <div>
      {isDesktopMode ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Filters
            </h2>

            <button
              type="button"
              disabled={!hasAnyFilter}
              onClick={resetFilters}
              className="text-sm text-main-500 transition-colors hover:text-main-400 cursor-pointer disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:text-main-500"
            >
              Reset
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <FilterFields />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2>
              <button
                type="button"
                aria-expanded={isFiltersOpen}
                aria-controls="technician-filters"
                className="flex min-h-11 items-center"
                onClick={toggleFiltersOpen}
              >
                <span className="font-heading text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  Filters
                </span>

                <AnimatePresence initial={false}>
                  {hasAnyFilter && (
                    <motion.span
                      className="flex shrink-0 items-center gap-4 overflow-hidden whitespace-nowrap pl-4"
                      {...activeFiltersBadgeMotionProps}
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-500" />
                      <span className="font-heading text-xs font-semibold tracking-widest text-zinc-400 dark:text-zinc-500">
                        {activeFilterGroupsCount === 1
                          ? "1 active filter"
                          : `${activeFilterGroupsCount} active filters`}
                      </span>
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Chevron */}
                <svg
                  className={`ml-4 h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 ${isFiltersOpen ? "rotate-180" : ""}`}
                  aria-hidden="true"
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
              </button>
            </h2>

            <button
              type="button"
              disabled={!hasAnyFilter}
              onClick={resetFilters}
              className="text-sm text-main-500 transition-colors hover:text-main-400 cursor-pointer disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:text-main-500"
            >
              Reset
            </button>
          </div>
          <AnimatePresence initial={false}>
            {isFiltersOpen && (
              <motion.div
                className="flex flex-col gap-3"
                id="technician-filters"
                {...filtersRevealMotionProps}
              >
                <FilterFields />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default FilterPanel;
