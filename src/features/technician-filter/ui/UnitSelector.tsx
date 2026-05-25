import { useUnitsQuery } from "../../../entities/unit/useUnitsQuery";
import UnitCard from "../../../entities/unit/ui/UnitCard";
import UnitSkeleton from "../../../entities/unit/ui/UnitSkeleton";
import { useTechnicianFilters } from "../model/useTechnicianFilters";

function UnitSelector() {
  const { data, isPending, isError, error } = useUnitsQuery();
  const { filter, toggleUnit, clearUnits } = useTechnicianFilters();

  if (isPending) return <UnitSkeleton />;

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400">
        {error.message}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Top Row if any units selected: Info and Clear Button */}
      <div
        className={`overflow-hidden transition-all duration-200 ${filter.unitSlugs.length > 0 ? "max-h-10 mb-2" : "max-h-0"}`}
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
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {data && data.length > 0 ? (
          data.map((unit) => (
            <UnitCard
              key={unit.id}
              unit={unit}
              isSelected={filter.unitSlugs.includes(unit.slug)}
              onToggle={() => toggleUnit(unit.slug)}
            />
          ))
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
