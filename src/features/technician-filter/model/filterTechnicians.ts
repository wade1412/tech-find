import type { TechnicianIgnoreList } from "../../../entities/technician-ignore-list/technicianIgnoreList.types";
import type { TechnicianSkillSet } from "../../../entities/technician-skill-set/technicianSkillSet.types";
import type { Technician } from "../../../entities/technician/technician.types";

type FilterTechniciansParams = {
  technicians: Technician[];
  skills: TechnicianSkillSet[];
  ignoreLists: TechnicianIgnoreList[];
  selectedUnitIds: Set<string>;
};

export const filterTechnicians = ({
  technicians,
  skills,
  selectedUnitIds,
}: FilterTechniciansParams): Technician[] => {
  if (selectedUnitIds.size === 0) {
    return technicians;
  }

  // Group skills by tech Id
  const skillsByTechId = skills.reduce<Record<string, Set<string>>>(
    (acc, skill) => {
      if (!acc[skill.technician_id]) {
        acc[skill.technician_id] = new Set();
      }
      acc[skill.technician_id].add(skill.unit_id);
      return acc;
    },
    {},
  );

  function filterByUnit() {
    return technicians.filter((technician) => {
      const techUnitIds = new Set(skillsByTechId[technician.id]);
      return Array.from(selectedUnitIds).every((selectedId) =>
        techUnitIds.has(selectedId),
      );
    });
  }

  const filtered = filterByUnit();

  return filtered;
};
