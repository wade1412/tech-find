import type { TechnicianSkill } from "../../../entities/technician-skill-set/technicianSkillSet.types";
import type { Technician } from "../../../entities/technician/technician.types";
import type { FilterTechniciansParams } from "./filter.types";
import {
  hasBrandGroupSkill,
  hasSpecificIssueSkill,
  isIgnoredByTechnician,
  matchesCommercialMode,
  matchesBaseUnitSkill,
} from "./filter.helpers";

type SkillSetCheck = (techSkills: TechnicianSkill[], unitId: string) => boolean;
type FilterBooleanCondition = {
  isActive: boolean;
  check: (technician: Technician) => boolean;
};

export const filterTechnicians = ({
  filter,
  technicians,
  zonesByTechId,
  skillsByTechId,
  selectedZoneId,
  selectedUnits,
  selectedUnitIds,
  selectedBrandIds,
  selectedBrandGroupIds,
  //id set for ignore check
  selectedIssueIds,
  // id map needed for skill matching
  selectedIssueIdsByUnitId,
  ignoreListsByTechId,
}: FilterTechniciansParams): Technician[] => {
  //Filter by zone
  const techniciansInZone = selectedZoneId
    ? technicians.filter((technician) => {
        const techZones = zonesByTechId.get(technician.id) ?? new Set();
        return techZones.has(selectedZoneId);
      })
    : technicians;

  // If there are no units selected - return all technicians
  if (selectedUnitIds.size === 0) {
    return techniciansInZone;
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
  const relevantTechnicians: Technician[] = techniciansInZone.filter(
    (technician) => activeOptions.every((option) => option.check(technician)),
  );

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

  return relevantTechnicians.filter((technician) => {
    // Get Skills and Ignores by technician Id from map
    const techSkills = skillsByTechId.get(technician.id) ?? [];
    const ignoreList = ignoreListsByTechId.get(technician.id) ?? [];

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
      if (!hasSpecificIssueSkill(techSkills, unitId, selectedIssueIdsByUnitId))
        return false;

      return true;
    });
  });
};
