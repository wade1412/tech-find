import UnitCard from "../../../../entities/unit/ui/UnitCard";
import UnitSkeleton from "../../../../entities/unit/ui/UnitSkeleton";
import { useUnitsQuery } from "../../../../entities/unit/useUnitsQuery";
import ErrorMessage from "../../../../shared/ui/ErrorMessage";
import type { FilterState } from "../../model/filter.types";
import {
  getActiveJobOptions,
  getUnsupportedJobOptions,
} from "../../model/unitCompatibility";

interface UnitSelectorProps {
  filter: FilterState;
  toggleUnit: (unitSlug: string) => void;
  clearUnits: () => void;
}

function UnitSelector({ filter, toggleUnit, clearUnits }: UnitSelectorProps) {
  const { data, isPending, isError, error } = useUnitsQuery();
  const activeJobOptions = getActiveJobOptions(filter);

  if (isPending) return <UnitSkeleton />;

  if (isError) {
    return <ErrorMessage message={error?.message} />;
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Top Row if any units selected: Info and Clear Button */}
      <div
        className={`overflow-hidden transition-[opacity, height] duration-250 ${filter.unitSlugs.length > 0 ? "max-h-10 opacity-100" : "max-h-0 opacity-20"}`}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {filter.unitSlugs.length} selected
          </span>
          <button
            className="text-sm font-medium text-main-500 hover:text-main-400 transition-colors cursor-pointer"
            onClick={clearUnits}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Units Grid */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4">
        {data && data.length > 0 ? (
          data.map((unit) => {
            const isSelected = filter.unitSlugs.includes(unit.slug);
            const unsupportedOptions = getUnsupportedJobOptions(
              unit,
              activeJobOptions,
            );

            return (
              <UnitCard
                key={unit.id}
                unit={unit}
                isSelected={isSelected}
                unsupportedLabels={isSelected ? unsupportedOptions : []}
                onToggle={() => toggleUnit(unit.slug)}
              />
            );
          })
        ) : (
          <p className="col-span-full py-6 text-center text-sm text-zinc-400 dark:text-zinc-500">
            No units found
          </p>
        )}
      </div>
    </div>
  );
}

export default UnitSelector;
