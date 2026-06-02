type SortModeValue = "default" | "alias" | "home_zip_code" | "service_area";

type SortDirection = "asc" | "desc";

export type TechnicianSortOption = {
  sortMode: SortModeValue;
  sortDirection: SortDirection;
};

export type SortSelectOption = {
  label: string;
  value: SortModeValue;
};

export type SortTuple = [SortModeValue, SortDirection];
