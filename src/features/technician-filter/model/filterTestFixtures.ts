import type { FilterState, FilterTechniciansParams } from "./filter.types";

type ParamsOverrides = Partial<Omit<FilterTechniciansParams, "filter">> & {
  filter?: Partial<FilterState>;
};

const defaultFilter: FilterState = {
  unitSlugs: [],
  brandSlugs: [],
  specificIssueSlugs: [],
  isGas: false,
  isCommercial: false,
  isInstallation: false,
  isStacked: false,
  sort: "default.asc",
  zone: "",
};

export const makeFilterParams = (
  overrides: ParamsOverrides = {},
): FilterTechniciansParams => {
  const { filter, ...params } = overrides;

  return {
    technicians: [],
    zonesByTechId: new Map(),
    skillsByTechId: new Map(),
    selectedUnits: [],
    selectedZoneId: "",
    selectedUnitIds: new Set(),
    selectedBrandIds: new Set(),
    selectedBrandGroupIds: new Set(),
    selectedIssueIds: new Set(),
    selectedIssueIdsByUnitId: new Map(),
    ignoreListsByTechId: new Map(),

    // Override default values with params
    ...params,

    filter: {
      ...defaultFilter,
      ...filter,
    },
  };
};
