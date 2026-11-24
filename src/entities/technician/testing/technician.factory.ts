import type { Technician } from "../technician.types";

export const makeTechnician = (
  overrides: Partial<Technician> = {},
): Technician => ({
  active_before_archive: null,
  archived_at: null,
  archived_by: null,
  id: "tech-1",
  name: "Default Name",
  alias: "Default Alias",
  notes: null,
  active: true,
  jobs_per_day: "2-3",
  home_zip_code: "28100",
  gas: false,
  commercial: false,
  can_provide_installation: false,
  can_service_built_in: false,
  can_service_stacked_washer: false,
  can_service_stacked_dryer: false,
  ...overrides,
});
