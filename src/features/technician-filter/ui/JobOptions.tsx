import { useEffect } from "react";
import { useUnitsQuery } from "../../../entities/unit/useUnitsQuery";
import { filterCheckboxes } from "../model/filter.constants";
import { useTechnicianFilters } from "../model/useTechnicianFilters";
import Checkbox from "../../../shared/ui/Checkbox";
import type { JobOptionKey } from "../model/filter.types";
import ErrorMessage from "../../../shared/ui/ErrorMessage";

function JobOptions() {
  const { data: units, isPending, isError, error } = useUnitsQuery();

  const {
    filter,
    toggleGas,
    toggleStacked,
    toggleInstallation,
    toggleCommercial,
    clearOptionByKeys,
  } = useTechnicianFilters();

  const selectedUnits =
    units?.filter((unit) => filter.unitSlugs.includes(unit.slug)) || [];
  // Flags to check if the option should be disabled
  const canBeGas = selectedUnits.some((el) => el.can_be_gas);
  const canBeStacked = selectedUnits.some((el) => el.can_be_stacked);
  const canBeCommercial =
    selectedUnits.some((el) => el.can_be_commercial) && !filter.isInstallation;

  const options: Record<
    JobOptionKey,
    {
      disabled: boolean;
      checked: boolean;
      onChange: () => void;
    }
  > = {
    gas: {
      disabled: !canBeGas,
      checked: filter.isGas,
      onChange: toggleGas,
    },
    stacked: {
      disabled: !canBeStacked,
      checked: filter.isStacked,
      onChange: toggleStacked,
    },
    installation: {
      disabled: selectedUnits.length === 0,
      checked: filter.isInstallation,
      onChange: toggleInstallation,
    },
    commercial: {
      disabled: !canBeCommercial,
      checked: filter.isCommercial,
      onChange: toggleCommercial,
    },
  };

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
    return <ErrorMessage message={error.message} />;
  }

  return (
    <div key="job-options">
      <div className="mb-3 flex flex-row gap-4">
        {filterCheckboxes.map((optionName: JobOptionKey) => (
          <Checkbox
            disabled={options[optionName].disabled}
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
