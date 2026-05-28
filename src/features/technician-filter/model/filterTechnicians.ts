import type { TechnicianIgnoreList } from "../../../entities/technician-ignore-list/technicianIgnoreList.types";
import type { TechnicianSkill as TechnicianSkill } from "../../../entities/technician-skill-set/technicianSkillSet.types";
import type { Technician } from "../../../entities/technician/technician.types";
import type { Unit } from "../../../entities/unit/unit.types";
import type { FilterState } from "./filter.types";

type FilterTechniciansParams = {
  filter: FilterState;
  technicians: Technician[];
  skills: TechnicianSkill[];
  selectedUnits: Unit[];
  selectedUnitIds: Set<string>;
  selectedBrandIds: Set<string>;
  selectedBrandGroupIds: Set<string>;
  selectedIssueIdsByUnitId: Map<string, Set<string>>;
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
  selectedBrandIds,
  selectedBrandGroupIds,
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

  // Get relevant technicians that pass the boolean checks
  const getRelevantTechnicians = () => {
    const activeOptions = options.filter((opt) => opt.isActive);
    return technicians.filter((technician) =>
      activeOptions.every((option) => option.check(technician)),
    );
  };

  const relevantTechnicians = getRelevantTechnicians();

  // Create a skill map -  technicianId: all skills for this technician
  const skillsByTechId = skills.reduce<Record<string, TechnicianSkill[]>>(
    (acc, skill) => {
      if (!acc[skill.technician_id]) {
        acc[skill.technician_id] = [];
      }
      acc[skill.technician_id].push(skill);
      return acc;
    },
    {},
  );

  type SkillCheck = (
    skill: TechnicianSkill,
    unitId?: string,
    groupId?: string,
  ) => boolean;

  // Check is the skill is basic for this unit
  const matchesUnit: SkillCheck = (skill, unitId) =>
    skill.unit_id === unitId && !skill.specific_issue_id;

  // Check if the technician has commerial skill
  const isCommercialSkill: SkillCheck = (skill) =>
    skill.commercial === filter.isCommercial;

  const hasSpecificIssueSkill = (
    techSkills: TechnicianSkill[],
    unitId: string,
  ) => {
    // Get Set of speceific issues for this unit
    const issueIds = selectedIssueIdsByUnitId.get(unitId);
    // Return early on empty Set
    if (!issueIds?.size) return true;

    return techSkills.some(
      (skill) =>
        // Check if the skill is for relevant unit and has a correct issue id
        skill.unit_id === unitId && issueIds.has(skill.specific_issue_id ?? ""),
    );
  };
  // Check if the technician has skills the selected brand groups
  const hasBrandGroupSkill = (
    techSkills: TechnicianSkill[],
    unitId: string,
    groupId: string,
  ): boolean =>
    techSkills.some(
      (skill) => matchesUnit(skill, unitId) && skill.brand_group_id === groupId,
    );

  function applyFilters(): Technician[] {
    //Return early if no technicians passed boolean checks
    if (relevantTechnicians.length === 0) return relevantTechnicians;

    return relevantTechnicians.filter((technician) => {
      // Find Skills by technician Id
      const techSkills = skillsByTechId[technician.id] || [];

      return Array.from(selectedUnitIds).every((unitId) => {
        // Skill check by units
        if (
          !techSkills.some((skill) => {
            // Commercial check
            if (filter.isCommercial && !isCommercialSkill(skill, unitId))
              return false;
            // Unit Skill Check
            if (!matchesUnit(skill, unitId)) return false;

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
          !hasSpecificIssueSkill(techSkills, unitId)
        ) {
          return false;
        }

        return true;
      });
    });
  }

  const filtered = applyFilters();

  return filtered;
};
