import { sortOptions } from "../model/sort.constants";
import type { SortTuple } from "../model/technicianSort.types";

interface TechnicianSortSelectProps {
  currentSortOption: SortTuple;
  updateSort: (newValue: string) => void;
}

const TechnicianSortSelect = ({
  currentSortOption,
  updateSort,
}: TechnicianSortSelectProps) => {
  const [value, sortOrder] = currentSortOption;

  const isDefault = value === "default";
  const isDesc = !isDefault && sortOrder === "desc";
  return (
    <div className="flex items-center gap-1.5 justify-between">
      <span className="text-xs text-zinc-400 dark:text-zinc-500">Sort by</span>

      <div className="flex justify-between">
        {sortOptions.map((option) => (
          <button
            key={option.value}
            onClick={() =>
              // Toggle sortOrder on additional clicks
              updateSort(
                option.value === "default"
                  ? "default.asc"
                  : `${option.value}.${value === option.value && isDesc ? "asc" : "desc"}`,
              )
            }
            className={`
          flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs transition-all duration-150
          ${
            value === option.value
              ? "bg-zinc-100 font-medium text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100"
              : "text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
          }
        `}
          >
            {option.label}

            {value === option.value && !isDefault && (
              // Direction toggle only for not default options
              <span
                className={`transition-transform duration-200 ${isDesc ? "rotate-180" : "rotate-0"}`}
              >
                ↑
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TechnicianSortSelect;
