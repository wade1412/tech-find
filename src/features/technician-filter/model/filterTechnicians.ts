import type { Technician } from "../../../entities/technician/technician.types";

import type {
  FilterBooleanCondition,
  FilterTechniciansParams,
} from "./filter.types";
import {
  createTechnicianDataMapById,
  hasBrandGroupSkill,
  hasSpecificIssueSkill,
  isIgnoredByTechnician,
  matchesCommercialMode,
  matchesBaseUnitSkill,
} from "./filterHelpers";

export const filterTechnicians = ({
  filter,
  technicians,
  skills,
  selectedUnits,
  selectedUnitIds,
  selectedBrandIds,
  selectedBrandGroupIds,
  selectedIssueIds,
  selectedIssueIdsByUnitId,
  ignoreLists,
}: FilterTechniciansParams): Technician[] => {
  // If there are no units selected - return all technicians
  if (selectedUnitIds.size === 0) {
    return technicians;
  }

  // Get Boolean options
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

  const options: FilterBooleanCondition[] = [
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

  const activeOptions = options.filter((opt) => opt.isActive);
  // Get relevant technicians that pass the boolean checks
  const relevantTechnicians: Technician[] = technicians.filter((technician) =>
    activeOptions.every((option) => option.check(technician)),
  );

  // Create a skill map -  technicianId: skills for this technician
  const skillsByTechId = createTechnicianDataMapById(skills);

  // Create an ignore map - technician Id: ignore list
  const ignoreListsByTechId = createTechnicianDataMapById(ignoreLists);

  //Return early if no technicians passed boolean checks
  if (relevantTechnicians.length === 0) return relevantTechnicians;

  return relevantTechnicians.filter((technician) => {
    // Get Skills by technician Id from map
    const techSkills = skillsByTechId[technician.id] || [];
    // Get Ignore
    const ignoreList = ignoreListsByTechId[technician.id] || [];

    // Check if service is ignored by technician
    if (
      isIgnoredByTechnician(
        ignoreList,
        selectedUnitIds,
        selectedBrandIds,
        selectedIssueIds,
      )
    ) {
      return false;
    }

    return Array.from(selectedUnitIds).every((unitId) => {
      // Skill check by units
      if (
        !techSkills.some((skill) => {
          // Commercial check on comercial flag
          if (!matchesCommercialMode(skill, filter.isCommercial)) {
            return false;
          }
          // Unit Skill Check
          if (!matchesBaseUnitSkill(skill, unitId)) {
            return false;
          }

          return true;
        })
      ) {
        return false;
      }

      // Brand groups check: ignore if commercial flag or no brands selected
      if (
        !filter.isCommercial &&
        selectedBrandIds.size > 0 &&
        !Array.from(selectedBrandGroupIds).every((groupId) =>
          hasBrandGroupSkill(techSkills, unitId, groupId),
        )
      ) {
        return false;
      }

      // Specific Issues check: ignore if no specific issues selected
      if (
        selectedIssueIdsByUnitId.size > 0 &&
        !hasSpecificIssueSkill(techSkills, unitId, selectedIssueIdsByUnitId)
      ) {
        return false;
      }

      return true;
    });
  });
};
