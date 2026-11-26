import type { Unit } from "../../../../entities/unit/unit.types";
import type { FilterState } from "../../model/filter.types";

type HintMessageKey =
  | "stackedWasherService"
  | "heavyUnitInstallation"
  | "gasStove"
  | "microwave"
  | "stoveOrOven";

type HintMessageTemplate = Record<HintMessageKey, string>;
type HintMessage = (typeof HINT_MESSAGES)[HintMessageKey];

type InstallationAndSelectionChecksResult = {
  isWasherSelectedAndCanBeInstalled: boolean;
  isDryerSelectedAndCanBeInstalled: boolean;
  isStoveSelectedAndCanBeInstalled: boolean;
  isBuiltInOvenSelectedAndCanBeInstalled: boolean;
  isFridgeSelectedAndCanBeInstalled: boolean;
};

const HINT_MESSAGES: HintMessageTemplate = {
  heavyUnitInstallation:
    "A second technician (helper) is required for stacked washer/dryer units, double wall ovens, heavy refrigerators, and gas stoves.",
  stackedWasherService:
    "The technician can provide diagnostics by himself for stacked washer, but likely needs a second technician (helper) to provide any repairs.",
  gasStove:
    'Gas stoves are heavy and may require a technician equipped for built-in appliances. Also select "Built In Oven" to see technicians with the needed equipment.',
  microwave: `Confirm with the customer whether it is an over-the-range microwave or a microwave/oven combo. Combos require a technician equipped for built-in appliances — also select "Built In Oven" to see technicians with the needed equipment.`,
  stoveOrOven:
    "Confirm with the customer whether they have a range (oven with cooktop) or a built-in oven, and select the matching unit.",
};

const getInstallationAndSelectionChecks = (
  selectedUnitSlugsSet: Set<string>,
  units: Unit[],
): InstallationAndSelectionChecksResult => {
  const result: InstallationAndSelectionChecksResult = {
    isWasherSelectedAndCanBeInstalled: false,
    isDryerSelectedAndCanBeInstalled: false,
    isStoveSelectedAndCanBeInstalled: false,
    isBuiltInOvenSelectedAndCanBeInstalled: false,
    isFridgeSelectedAndCanBeInstalled: false,
  };

  units.forEach((unit) => {
    switch (unit.slug) {
      case "washer":
        result.isWasherSelectedAndCanBeInstalled =
          selectedUnitSlugsSet.has("washer") && unit.can_be_installed;
        break;

      case "dryer":
        result.isDryerSelectedAndCanBeInstalled =
          selectedUnitSlugsSet.has("dryer") && unit.can_be_installed;
        break;

      case "stove-range":
        result.isStoveSelectedAndCanBeInstalled =
          selectedUnitSlugsSet.has("stove-range") && unit.can_be_installed;
        break;

      case "built-in-oven":
        result.isBuiltInOvenSelectedAndCanBeInstalled =
          selectedUnitSlugsSet.has("built-in-oven") && unit.can_be_installed;
        break;

      case "fridge":
        result.isFridgeSelectedAndCanBeInstalled =
          selectedUnitSlugsSet.has("fridge") && unit.can_be_installed;
        break;
    }
  });

  return result;
};

export const getHintMessage = (
  filter: FilterState,
  units: Unit[] | undefined,
): HintMessage | null => {
  if (!units) return null;

  const selectedUnitSlugsSet = new Set(filter.unitSlugs);
  const isStackedWasherSelected =
    filter.isStacked && selectedUnitSlugsSet.has("washer");
  const isGasStoveSelected =
    selectedUnitSlugsSet.has("stove-range") && filter.isGas;

  const installationChecks = getInstallationAndSelectionChecks(
    selectedUnitSlugsSet,
    units,
  );

  const isMicrowaveSelected = selectedUnitSlugsSet.has("microwave");
  const isStoveOrOvenSelected = selectedUnitSlugsSet.has("stove-range");

  const isHeavyUnitSelected =
    (filter.isStacked &&
      (installationChecks.isDryerSelectedAndCanBeInstalled ||
        installationChecks.isWasherSelectedAndCanBeInstalled)) ||
    (filter.isGas && installationChecks.isStoveSelectedAndCanBeInstalled) ||
    installationChecks.isBuiltInOvenSelectedAndCanBeInstalled ||
    installationChecks.isFridgeSelectedAndCanBeInstalled;

  const isHeavyUnitInstallation = filter.isInstallation && isHeavyUnitSelected;

  if (isHeavyUnitInstallation) {
    return HINT_MESSAGES.heavyUnitInstallation;
  }

  if (isStackedWasherSelected) {
    return HINT_MESSAGES.stackedWasherService;
  }

  if (isGasStoveSelected) {
    return HINT_MESSAGES.gasStove;
  }

  if (isMicrowaveSelected) {
    return HINT_MESSAGES.microwave;
  }

  if (isStoveOrOvenSelected) {
    return HINT_MESSAGES.stoveOrOven;
  }

  return null;
};
