import type { Technician } from "../../../entities/technician/technician.types";

const normalize = (value: string) => value.trim().toLowerCase();

export const filterTechniciansBySearch = (
  technicians: Technician[],
  searchTerm: string,
  zoneNamesByTechnicianId: ReadonlyMap<string, string[]>,
) => {
  const terms = normalize(searchTerm).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return technicians;

  const getTechnicianSearchableString = (technician: Technician) => {
    const techZones = zoneNamesByTechnicianId.get(technician.id) || [];

    const fields = [
      technician.alias,
      technician.name,
      technician.home_zip_code,
      techZones.join(","),
    ];

    return normalize(fields.join(""));
  };

  const foundTechnicians = technicians.filter((technician) => {
    const searchableText = getTechnicianSearchableString(technician);

    return terms.every((term) => searchableText.includes(term));
  });

  return foundTechnicians;
};
