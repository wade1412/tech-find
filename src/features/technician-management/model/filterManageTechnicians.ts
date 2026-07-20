import type { Technician } from "../../../entities/technician/technician.types";
import { normalizeSearchText } from "../../../shared/model/helpers";
import type { ManageTechniciansListFilterValue } from "./manageTechnicians.constants";

type FilterManageTechniciansParams = {
  technicians: Technician[];
  searchTerm: string;
  status: ManageTechniciansListFilterValue;
  zoneNamesByTechnicianId: ReadonlyMap<string, string[]>;
};

export const filterManageTechnicians = ({
  technicians,
  searchTerm,
  status,
  zoneNamesByTechnicianId,
}: FilterManageTechniciansParams) => {
  const normalizedSearchTerm = normalizeSearchText(searchTerm);
  const terms = normalizedSearchTerm ? normalizedSearchTerm.split(" ") : [];

  return technicians.filter((technician) => {
    const matchesStatus =
      status === "all" || technician.active === (status === "active");

    if (!matchesStatus) return false;
    if (terms.length === 0) return true;

    const technicianZones = zoneNamesByTechnicianId.get(technician.id) ?? [];
    const searchableText = normalizeSearchText(
      [
        technician.alias,
        technician.name,
        technician.home_zip_code,
        ...technicianZones,
      ].join(" "),
    );

    return terms.every((term) => searchableText.includes(term));
  });
};
