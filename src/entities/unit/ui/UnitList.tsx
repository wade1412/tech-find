import { useState } from "react";
import { useUnitsQuery } from "../useUnitsQuery";
import UnitCard from "./UnitCard";
import UnitSkeleton from "./UnitSkeleton";

function UnitList() {
  const { data, isPending, isError, error } = useUnitsQuery();

  const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([]);

  const isSelected = (id: string) => selectedUnitIds.includes(id);
  const toggleId = (id: string) =>
    setSelectedUnitIds((prev) =>
      prev.some((u) => u === id) ? prev.filter((u) => u !== id) : [...prev, id],
    );

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
        className={`overflow-hidden transition-all duration-200 ${selectedUnitIds.length > 0 ? "max-h-10 mb-2" : "max-h-0"}`}
      >
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {selectedUnitIds.length} selected
          </span>
          <button
            className="text-sm font-medium text-main-500 hover:text-main-400 transition-colors"
            onClick={() => setSelectedUnitIds([])}
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
              isSelected={isSelected(unit.id)}
              onToggle={() => toggleId(unit.id)}
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

export default UnitList;
