//Read sortMode from URL and pass it to sortTechncians and returned sorted array

import { useMemo } from "react";
import type { Technician } from "../../../entities/technician/technician.types";
import { sortTechnicians } from "./sortTechnicians";
import type { SortTuple } from "./technicianSort.types";

export const useTechnicianSort = (
  technicians: Technician[],
  sortOption: SortTuple,
): Technician[] => {
  const [value, direction] = sortOption;

  const sortedTechnicians = useMemo(() => {
    if (!technicians || !value || !direction) return technicians;

    return sortTechnicians(technicians, {
      sortMode: value,
      sortDirection: direction,
    });
  }, [technicians, value, direction]);

  return sortedTechnicians;
};
