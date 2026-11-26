import { useEffect } from "react";
import type { FilterState, JobOptionKey } from "../../model/filter.types";
import { useUnitsQuery } from "../../../../entities/unit/useUnitsQuery";
import Checkbox from "../../../../shared/ui/Checkbox";
import { filterCheckboxes } from "../../model/filter.constants";
import ErrorMessage from "../../../../shared/ui/ErrorMessage";
import { motion, AnimatePresence } from "motion/react";
import { heightRevealMotionProps } from "../../../../shared/styles/motionVariants";
import { getHintMessage } from "./hint.helpers";
import JobOptionsHint from "./JobOptionsHint";

interface JobOptionsProps {
  filter: FilterState;
  toggleGas: () => void;
  toggleStacked: () => void;
  toggleInstallation: () => void;
  toggleCommercial: () => void;
  clearOptionByKeys: (keys: JobOptionKey[]) => void;
}

function JobOptions({
  filter,
  toggleGas,
  toggleStacked,
  toggleInstallation,
  toggleCommercial,
  clearOptionByKeys,
}: JobOptionsProps) {
  const { data: units, isPending, isError, error } = useUnitsQuery();

  const hintMessage = getHintMessage(filter, units);

  const selectedUnits =
    units?.filter((unit) => filter.unitSlugs.includes(unit.slug)) || [];
  // Flags to check if the option should be disabled
  const canBeInstalled = selectedUnits.some((el) => el.can_be_installed);
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
      disabled: !canBeInstalled,
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
    if (!canBeInstalled && filter.isInstallation)
      invalidOptions.push("installation");
    if (!canBeCommercial && filter.isCommercial)
      invalidOptions.push("commercial");

    if (invalidOptions.length > 0) {
      clearOptionByKeys(invalidOptions);
    }
  }, [
    isPending,
    canBeGas,
    canBeStacked,
    canBeInstalled,
    canBeCommercial,
    selectedUnits.length,
    filter.isGas,
    filter.isStacked,
    filter.isInstallation,
    filter.isCommercial,
    clearOptionByKeys,
  ]);

  if (isError) {
    return <ErrorMessage message={error.message} />;
  }

  return (
    <div key="job-options" className="flex flex-col gap-2">
      <div className="flex flex-row gap-4">
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

      <AnimatePresence initial={false}>
        {hintMessage && (
          <motion.div {...heightRevealMotionProps}>
            <JobOptionsHint hintMessage={hintMessage} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default JobOptions;
