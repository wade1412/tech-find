import type { TechnicianIgnoreList } from "../../../entities/technician-ignore-list/technicianIgnoreList.types";
import type { TechnicianSkill } from "../../../entities/technician-skill-set/technicianSkillSet.types";
import type { Technician } from "../../../entities/technician/technician.types";
import type { Unit } from "../../../entities/unit/unit.types";
import type { FilterState, FilterTechniciansParams } from "./filter.types";

export const makeTechnician = (
  overrides: Partial<Technician> = {},
): Technician => ({
  id: "tech-1",
  name: "Default Name",
  alias: "Default Alias",
  notes: null,
  active: true,
  jobs_per_day: "test jobs per day",
  home_zip_code: "Test home zip",
  service_area: "Test service area",
  gas: false,
  commercial: false,
  can_service_built_in: false,
  can_service_stacked_washer: false,
  can_service_stacked_dryer: false,
  ...overrides,
});

export const makeUnit = (overrides: Partial<Unit> = {}): Unit => ({
  id: "unit-1",
  name: "Washer",
  slug: "washer",
  active: true,
  display_order: 1,
  is_built_in: false,
  can_be_gas: false,
  can_be_stacked: false,
  can_be_commercial: false,
  ...overrides,
});

export const makeSkill = (
  overrides: Partial<TechnicianSkill> = {},
): TechnicianSkill => ({
  id: "skill-1",
  technician_id: "tech-1",
  unit_id: "unit-1",
  brand_group_id: null,
  specific_issue_id: null,
  commercial: false,
  ...overrides,
});

export const makeIgnoreRule = (
  overrides: Partial<TechnicianIgnoreList> = {},
): TechnicianIgnoreList => ({
  id: "ignore-1",
  technician_id: "tech-1",
  unit_id: null,
  brand_id: null,
  specific_issue_id: null,
  ...overrides,
});

type ParamsOverrides = Omit<Partial<FilterTechniciansParams>, "filter"> & {
  filter?: Partial<FilterState>;
};

const defaultFilter: FilterState = {
  unitSlugs: [],
  brandSlugs: [],
  specificIssueSlugs: [],
  isGas: false,
  isCommercial: false,
  isStacked: false,
  sort: "default.asc",
  zone: "",
};

export const makeFilterParams = (overrides: ParamsOverrides) => {
  const { filter, ...params } = overrides;

  return {
    ...params,
    filter: { ...defaultFilter, ...filter },
  };
};
