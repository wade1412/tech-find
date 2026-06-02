//Read sortMode from URL and pass it to sortTechncians and returned sorted array

import type { Technician } from "../../../entities/technician/technician.types";
import { sortTechnicians } from "./sortTechnicians";
import type { SortTuple } from "./technicianSort.types";

export const useTechnicianSort = (
  technicians: Technician[],
  sortOption: SortTuple,
): Technician[] => {
  if (!technicians || !sortOption) return technicians;
  const [value, direction] = sortOption;

  const sortedTechnicians = sortTechnicians(technicians, {
    sortMode: value,
    sortDirection: direction,
  });

  return sortedTechnicians;
};
