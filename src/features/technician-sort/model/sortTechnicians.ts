import type { Technician } from "../../../entities/technician/technician.types";
import type { TechnicianSortOption } from "./technicianSort.types";

export function sortTechnicians(
  technicians: Technician[],
  sortOption: TechnicianSortOption,
) {
  const { sortMode, sortDirection } = sortOption;

  if (sortMode === "default") return technicians;

  const newArr = [...technicians];

  return newArr.sort((a, b) => {
    if (sortDirection === "asc") return a[sortMode].localeCompare(b[sortMode]);
    else return b[sortMode].localeCompare(a[sortMode]);
  });
}
