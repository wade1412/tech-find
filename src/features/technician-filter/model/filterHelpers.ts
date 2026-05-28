import type { TechnicianIgnoreList } from "../../../entities/technician-ignore-list/technicianIgnoreList.types";
import type { TechnicianSkill } from "../../../entities/technician-skill-set/technicianSkillSet.types";

type IgnoredCheckFunction = (
  ignoreList: TechnicianIgnoreList[],
  selectedUnitIds: Set<string>,
  selectedBrandIds: Set<string>,
  selectedIssueIds: Set<string>,
) => boolean;

// Helper for creating data maps by Id
export const createDataMapByTechnicianId = <
  T extends { technician_id: string },
>(
  technicianData: T[],
) => {
  return technicianData.reduce<Record<string, T[]>>((acc, dataEl) => {
    if (!acc[dataEl.technician_id]) {
      acc[dataEl.technician_id] = [];
    }

    acc[dataEl.technician_id].push(dataEl);

    return acc;
  }, {});
};

export const matchesBaseUnitSkill = (
  skill: TechnicianSkill,
  unitId: string,
): boolean => skill.unit_id === unitId && !skill.specific_issue_id;

// Check if the technician has commerial skill
export const matchesCommercialMode = (
  skill: TechnicianSkill,
  isCommercial: boolean,
): boolean => skill.commercial === isCommercial;

export const hasSpecificIssueSkill = (
  technicianSkills: TechnicianSkill[],
  unitId: string,
  issueMap: Map<string, Set<string>>,
): boolean => {
  // Get Set of specific issues for this unit
  const issueIds = issueMap?.get(unitId);
  // Return early if not found/empty set
  if (!issueIds?.size) return true;

  return technicianSkills.some(
    (skill) =>
      // Check if the skill is for relevant unit and has a correct issue id
      skill.unit_id === unitId && issueIds.has(skill.specific_issue_id ?? ""),
  );
};

export const hasBrandGroupSkill = (
  technicianSkills: TechnicianSkill[],
  unitId: string,
  groupId: string,
): boolean =>
  technicianSkills.some(
    (skill) =>
      matchesBaseUnitSkill(skill, unitId) && skill.brand_group_id === groupId,
  );

export const isIgnoredByTechnician: IgnoredCheckFunction = (
  ignoreList,
  selectedUnitIds,
  selectedBrandIds,
  selectedIssueIds,
) =>
  ignoreList.some((ignore) => {
    const unitMatches = !ignore.unit_id || selectedUnitIds.has(ignore.unit_id);

    const brandMatches =
      !ignore.brand_id || selectedBrandIds.has(ignore.brand_id);

    const issueMatches =
      !ignore.specific_issue_id ||
      selectedIssueIds.has(ignore.specific_issue_id);

    return unitMatches && brandMatches && issueMatches;
  });
