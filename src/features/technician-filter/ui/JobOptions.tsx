import { useEffect } from "react";
import { useUnitsQuery } from "../../../entities/unit/useUnitsQuery";
import { filterCheckboxes } from "../model/filter.constants";
import { useTechnicianFilters } from "../model/useTechnicianFilters";
import Checkbox from "../../../shared/ui/Checkbox";
import type { JobOptionKey } from "../model/filter.types";

function JobOptions() {
  const { data: units, isPending, isError, error } = useUnitsQuery();

  const {
    filter,
    toggleStacked,
    toggleCommercial,
    toggleGas,
    clearOptionByKeys,
  } = useTechnicianFilters();

  const selectedUnits =
    units?.filter((unit) => filter.unitSlugs.includes(unit.slug)) || [];

  const canBeGas = selectedUnits.some((el) => el.can_be_gas);
  const canBeStacked = selectedUnits.some((el) => el.can_be_stacked);
  const canBeCommercial = selectedUnits.some((el) => el.can_be_commercial);

  const options: Record<
    JobOptionKey,
    {
      visible: boolean;
      checked: boolean;
      onChange: () => void;
    }
  > = {
    gas: {
      visible: canBeGas,
      checked: filter.isGas,
      onChange: toggleGas,
    },
    stacked: {
      visible: canBeStacked,
      checked: filter.isStacked,
      onChange: toggleStacked,
    },
    commercial: {
      visible: canBeCommercial,
      checked: filter.isCommercial,
      onChange: toggleCommercial,
    },
  };

  const isOptionsActive = canBeGas || canBeStacked || canBeCommercial;

  // Sync URL params
  useEffect(() => {
    // Return on loading
    if (isPending) return;
    // When the checkbox was checked, but the unit has been de-selected - clear params
    const invalidOptions: JobOptionKey[] = [];
    if (!canBeGas && filter.isGas) invalidOptions.push("gas");
    if (!canBeStacked && filter.isStacked) invalidOptions.push("stacked");
    if (!canBeCommercial && filter.isCommercial)
      invalidOptions.push("commercial");

    if (invalidOptions.length > 0) {
      clearOptionByKeys(invalidOptions);
    }
  }, [
    isPending,
    canBeGas,
    canBeStacked,
    canBeCommercial,
    filter.isGas,
    filter.isStacked,
    filter.isCommercial,
    clearOptionByKeys,
  ]);

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400">
        {error.message}
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden transition-all duration-200 ${isOptionsActive ? "mb-3 max-h-24 md:max-h-16" : "max-h-0"}`}
    >
      <div className="flex flex-row gap-4">
        {filterCheckboxes
          .filter((optionName: JobOptionKey) => options[optionName].visible)
          .map((optionName: JobOptionKey) => (
            <Checkbox
              key={optionName}
              id={optionName}
              label={optionName.charAt(0).toUpperCase() + optionName.slice(1)}
              checked={options[optionName].checked}
              onChange={options[optionName].onChange}
            />
          ))}
      </div>
    </div>
  );
}

export default JobOptions;
