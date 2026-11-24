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
  // id set for ignore check
  selectedIssueIds,
  // id map needed for skill matching
  selectedIssueIdsByUnitId,
  ignoreListsByTechId,
}: FilterTechniciansParams): Technician[] => {
  // --------- 1) Zone Filtering  ---------

  const techniciansInZone = selectedZoneId
    ? technicians.filter((technician) => {
        const techZones = zonesByTechId.get(technician.id) ?? new Set();
        return techZones.has(selectedZoneId);
      })
    : technicians;

  // If there are no units selected - return all technicians early
  if (selectedUnitIds.size === 0) {
    return techniciansInZone;
  }

  // --------- 2) Job Options Filtering ---------

  const hasDryer =
    filter.isStacked && selectedUnits.some((unit) => unit.slug === "dryer");
  const hasWasher =
    filter.isStacked && selectedUnits.some((unit) => unit.slug === "washer");

  // Generate options - is it active and check function for it
  const options: FilterBooleanCondition[] = [
    {
      isActive: filter.isGas,
      check: (technician) => technician.gas,
    },
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
      isActive: filter.isInstallation,
      check: (technican) => technican.can_provide_installation,
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

  // Get relevant technicians that pass the boolean checks set by the job options
  // we just need to check the tag, because if the technician does not have the needed skill for the unit he will be filtered out later
  const relevantTechnicians: Technician[] = techniciansInZone.filter(
    (technician) => activeOptions.every((option) => option.check(technician)),
  );
  // Return early if no technicians passed boolean checks, empty array is handled by the UI component
  if (relevantTechnicians.length === 0) return relevantTechnicians;

  // --------- 4) Unit and Brands Filtering helpers ---------

  // Create arrays from sets
  const selectedUnitIdList = Array.from(selectedUnitIds);
  const selectedBrandGroupIdList = Array.from(selectedBrandGroupIds);

  // A) Check if the technician has the skill for the selected unit: commercian and general
  const hasUnitSkill: SkillSetCheck = (techSkills, unitId): boolean =>
    techSkills.some((skill) => {
      // Check if the technician has a commercial skill for this unit if the commercial job options has been selected
      // Note: Commercial skills are separated from regular and high end brands, so if the technician has skills for commercial and regular brands of fridges
      // those would be two different rows, that is why one check does not overrule the other
      if (!matchesCommercialMode(skill, filter.isCommercial)) {
        return false;
      }
      // Check if the technician has the general skill for this unit
      if (!matchesBaseUnitSkill(skill, unitId)) {
        return false;
      }

      return true;
    });

  // B) Check if the technician has the skill for the selected brand group
  const hasRequiredBrandGroups: SkillSetCheck = (techSkills, unitId) => {
    // Commercial job option disables brands, so return ealry if its true or if no brands are selected
    if (filter.isCommercial) return true;
    if (selectedBrandGroupIdList.length === 0) return true;

    // Check if the technician has the skills for every selected brandgroup
    return selectedBrandGroupIdList.every((groupId) =>
      hasBrandGroupSkill(techSkills, unitId, groupId),
    );
  };

  // --------- 5) Filtering by Ignore List, Unit, Brands and Specific Issues ---------

  return relevantTechnicians.filter((technician) => {
    // Get Skills and Ignores by technician Id from the maps
    const techSkills = skillsByTechId.get(technician.id) ?? [];
    const ignoreList = ignoreListsByTechId.get(technician.id) ?? [];

    // Check if the selected units, brands and spec. issues are ignored by the technician and return early
    if (
      isIgnoredByTechnician(
        ignoreList,
        selectedUnitIds,
        selectedBrandIds,
        selectedIssueIds,
      )
    )
      return false;

    // Final check: can service unit, can service selected brand & commercial, can service speccific issues if those are selected
    return selectedUnitIdList.every((unitId) => {
      if (!hasUnitSkill(techSkills, unitId)) return false;
      if (!hasRequiredBrandGroups(techSkills, unitId)) return false;
      if (!hasSpecificIssueSkill(techSkills, unitId, selectedIssueIdsByUnitId))
        return false;

      return true;
    });
  });
};
