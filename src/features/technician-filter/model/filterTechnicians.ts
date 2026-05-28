import type { TechnicianSkill } from "../../../entities/technician-skill-set/technicianSkillSet.types";
import type { Technician } from "../../../entities/technician/technician.types";

type SkillSetCheck = (techSkills: TechnicianSkill[], unitId: string) => boolean;

import type {
  FilterBooleanCondition,
  FilterTechniciansParams,
} from "./filter.types";
import {
  createDataMapByTechnicianId,
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
  if (selectedUnitIds.size === 0 && selectedBrandIds.size === 0) {
    return technicians;
  }

  const hasDryer =
    filter.isStacked && selectedUnits.some((unit) => unit.slug === "dryer");
  const hasWasher =
    filter.isStacked && selectedUnits.some((unit) => unit.slug === "washer");

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
  const skillsByTechId = createDataMapByTechnicianId(skills);
  // Create an ignore map - technician Id: ignore list
  const ignoreListsByTechId = createDataMapByTechnicianId(ignoreLists);

  //Return early if no technicians passed boolean checks
  if (relevantTechnicians.length === 0) return relevantTechnicians;

  const selectedUnitIdList = Array.from(selectedUnitIds);
  const selectedBrandGroupIdList = Array.from(selectedBrandGroupIds);

  const hasUnitSkill: SkillSetCheck = (techSkills, unitId): boolean =>
    techSkills.some((skill) => {
      // Commercial check on comercial flag
      if (!matchesCommercialMode(skill, filter.isCommercial)) {
        return false;
      }
      // Unit Skill Check
      if (!matchesBaseUnitSkill(skill, unitId)) {
        return false;
      }

      return true;
    });

  const hasRequiredBrandGroups: SkillSetCheck = (techSkills, unitId) => {
    if (filter.isCommercial) return true;
    if (selectedBrandGroupIdList.length === 0) return true;

    return selectedBrandGroupIdList.every((groupId) =>
      hasBrandGroupSkill(techSkills, unitId, groupId),
    );
  };

  const hasRequiredSpecificIssues: SkillSetCheck = (techSkills, unitId) => {
    const issueIdsForUnit = selectedIssueIdsByUnitId.get(unitId);

    if (!issueIdsForUnit || issueIdsForUnit.size === 0) {
      return true;
    }

    return hasSpecificIssueSkill(techSkills, unitId, selectedIssueIdsByUnitId);
  };

  return relevantTechnicians.filter((technician) => {
    // Get Skills and Ignores by technician Id from map
    const techSkills = skillsByTechId[technician.id] || [];
    const ignoreList = ignoreListsByTechId[technician.id] || [];

    if (
      isIgnoredByTechnician(
        ignoreList,
        selectedUnitIds,
        selectedBrandIds,
        selectedIssueIds,
      )
    )
      return false;

    return selectedUnitIdList.every((unitId) => {
      if (!hasUnitSkill(techSkills, unitId)) return false;
      if (!hasRequiredBrandGroups(techSkills, unitId)) return false;
      if (!hasRequiredSpecificIssues(techSkills, unitId)) return false;

      return true;
    });
  });
};
