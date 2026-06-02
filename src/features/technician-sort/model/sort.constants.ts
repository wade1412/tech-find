import type { SortModeValue, SortSelectOption } from "./technicianSort.types";

export const sortOptions: SortSelectOption[] = [
  { label: "", value: "default" },
  { label: "Name", value: "alias" },
  { label: "Zip", value: "home_zip_code" },
  { label: "Service Area", value: "service_area" },
];

export const sortModes: SortModeValue[] = [
  "default",
  "alias",
  "home_zip_code",
  "service_area",
];
