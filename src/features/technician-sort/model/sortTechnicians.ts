// Sort functionality:
// get filteredTechs => return sorted techs

import type { Technician } from "../../../entities/technician/technician.types";
import type { TechnicianSortMode } from "./technicianSort.types";

export function sortTechnicians(
  technicians: Technician[],
  sortMode: TechnicianSortMode,
) {
  if (sortMode === "default") return technicians;

  // switch Sort Mode logic
}
