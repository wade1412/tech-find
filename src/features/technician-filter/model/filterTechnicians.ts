import type { Brand } from "../../../entities/brand/brand.types";
import type { TechnicianIgnoreList } from "../../../entities/technician-ignore-list/technicianIgnoreList.types";
import type { TechnicianSkillSet } from "../../../entities/technician-skill-set/technicianSkillSet.types";
import type { Technician } from "../../../entities/technician/technician.types";
import type { Unit } from "../../../entities/unit/unit.types";
import type { FilterState } from "./filter.types";

type FilterTechniciansParams = {
  filter: FilterState;
  technicians: Technician[];
  skills: TechnicianSkillSet[];
  selectedUnits: Unit[];
  selectedUnitIds: Set<string>;
  selectedBrands: Brand[];
  selectedBrandIds: Set<string>;
  selectedBrandGroupIds: Set<string>;
  specificIssueIds: Set<string>;
  ignoreLists: TechnicianIgnoreList[];
};

type BooleanCondition = {
  isActive: boolean;
  check: (technician: Technician) => boolean;
};

export const filterTechnicians = ({
  filter,
  technicians,
  skills,
  selectedUnits,
  selectedUnitIds,
  selectedBrands,
  selectedBrandIds,
  selectedBrandGroupIds,
  specificIssueIds,
  ignoreLists,
}: FilterTechniciansParams): Technician[] => {
  // If there are no units selected - return all technicians
  if (selectedUnitIds.size === 0) {
    return technicians;
  }

  const getStackedUnitSlugs = () => {
    if (!filter.isStacked) return new Set<string>();

    return new Set(
      selectedUnits
        .filter((un) => un.slug === "washer" || un.slug === "dryer")
        .map((u) => u.slug),
    );
  };

  const stackedUnitSlugs = getStackedUnitSlugs();
  const hasDryer = stackedUnitSlugs.has("dryer");
  const hasWasher = stackedUnitSlugs.has("washer");

  const options: BooleanCondition[] = [
    {
      isActive: filter.isStacked,
      check: (technician) => {
        if (hasDryer && hasWasher) {
          return (
            technician.can_service_stacked_dryer &&
            technician.can_service_stacked_washer
          );
        }
        if (hasDryer) {
          return technician.can_service_stacked_dryer;
        }
        if (hasWasher) {
          return technician.can_service_stacked_washer;
        }

        return true;
      },
    },
    {
      isActive: filter.isGas,
      check: (technician) => technician.gas,
    },
    {
      isActive: filter.isCommercial,
      check: (technician) => technician.commercial,
    },
    {
      isActive: selectedUnits.some((unit) => unit.is_built_in),
      check: (technician) => technician.can_service_built_in,
    },
  ];

  const getRelevantTechnicians = () => {
    const activeOptions = options.filter((opt) => opt.isActive);
    return technicians.filter((technician) =>
      activeOptions.every((option) => option.check(technician)),
    );
  };

  const relevantTechnicians = getRelevantTechnicians();

  // Create a map -  technicianId: all skills for this technician
  const skillsByTechId = skills.reduce<Record<string, TechnicianSkillSet[]>>(
    (acc, skill) => {
      if (!acc[skill.technician_id]) {
        acc[skill.technician_id] = [];
      }
      acc[skill.technician_id].push(skill);
      return acc;
    },
    {},
  );

  function applyFilters(): Technician[] {
    if (relevantTechnicians.length === 0) return relevantTechnicians;

    return relevantTechnicians.filter((technician) => {
      // Find Skills by technician Id
      const techSkills = skillsByTechId[technician.id] || [];

      return Array.from(selectedUnitIds).every((unitId) => {
        return techSkills.some((skill) => {
          // Check if technician can service this (false if no entry in his skills row)
          // - unit
          if (skill.unit_id !== unitId) return false;
          // - commerical unit if isCommercial
          if (filter.isCommercial && !skill.commercial) return false;
          // - brand group
          // - specific issue
          return true;
        });
      });
    });
  }

  const filtered = applyFilters();

  return filtered;
};
