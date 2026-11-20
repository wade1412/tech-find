import type { Unit } from "../../../entities/unit/unit.types";
import type { FilterState, JobOptionKey } from "./filter.types";

// Which flag the job option requires
const unitFlagByOption = {
  gas: "can_be_gas",
  stacked: "can_be_stacked",
  installation: "can_be_installed",
  commercial: "can_be_commercial",
} as const satisfies Record<JobOptionKey, keyof Unit>;

export const getActiveJobOptions = (filter: FilterState): JobOptionKey[] => {
  const activeJobOptions: JobOptionKey[] = [];

  if (filter.isGas) activeJobOptions.push("gas");
  if (filter.isStacked) activeJobOptions.push("stacked");
  if (filter.isInstallation) activeJobOptions.push("installation");
  if (filter.isCommercial) activeJobOptions.push("commercial");

  return activeJobOptions;
};

// Get options that are active but are not supported by this unit
export const getUnsupportedJobOptions = (
  unit: Unit,
  activeJobOptions: JobOptionKey[],
): JobOptionKey[] => {
  return activeJobOptions.filter((opt) => !unit[unitFlagByOption[opt]]);
};
