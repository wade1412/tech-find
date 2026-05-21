export type Technician = {
  id: string;
  active: boolean;
  name: string;
  alias: string | null;
  notes: string | null;
  can_service_built_in: boolean;
  gas: boolean;
  commercial: boolean;
  can_service_stacked_washer: boolean;
  can_service_stacked_dryer: boolean;
  jobs_per_day: string;
  home_zip_code: string;
  service_area: string;
};
