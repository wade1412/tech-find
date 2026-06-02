import type { SortModeValue, SortSelectOption } from "./technicianSort.types";

export const sortModes: SortModeValue[] = [
  "default",
  "alias",
  "home_zip_code",
  "service_area",
];

export const sortOptions: SortSelectOption[] = sortModes.map((mode) => {
  let label: string = mode;

  if (mode === "alias") {
    label = "Name";
  } else if (mode === "home_zip_code") {
    label = "Zip";
  } else {
    const spaced = label.replace(/_/, " ");
    label = spaced.charAt(0).toUpperCase() + spaced.slice(1);
  }

  return {
    label,
    value: mode,
  };
});
