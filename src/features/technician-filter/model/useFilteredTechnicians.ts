import { useMemo } from "react";
import { useBrandsQuery } from "../../../entities/brand/useBrandsQuery";
import { useTechnicianIgnoreListQuery } from "../../../entities/technician-ignore-list/technicianIgnoreListQuery";
import { useTechnicianSkillSetQuery } from "../../../entities/technician-skill-set/technicianSkillSetQuery";
import { useTechniciansQuery } from "../../../entities/technician/useTechniciansQuery";
import { useUnitsQuery } from "../../../entities/unit/useUnitsQuery";
import { useTechnicianFilters } from "./useTechnicianFilters";
import { useSpecificIssuesQuery } from "../../../entities/specific-issue/useSpecificIssuesQuery";
import { filterTechnicians } from "./filterTechnicians";
import { createDataMapByTechnicianId } from "./filterHelpers";
import { SPECIAL_ISSUE_SLUGS, SPECIAL_UNIT_SLUGS } from "./filter.constants";

export const useFilteredTechnicians = () => {
  const { filter } = useTechnicianFilters();
  const {
    data: technicians,
    isPending: isTechniciansPending,
    isError: techniciansError,
    error: techniciansErrorObject,
  } = useTechniciansQuery();
  const {
    data: units,
    isPending: isUnitsPending,
    isError: unitsError,
    error: unitsErrorObject,
  } = useUnitsQuery();
  const {
    data: brands,
    isPending: isBrandsPending,
    isError: brandsError,
    error: brandsErrorObject,
  } = useBrandsQuery();
  const {
    data: specificIssues,
    isPending: isIssuesPending,
    isError: specificIssuesError,
    error: specificIssuesErrorObject,
  } = useSpecificIssuesQuery();
  const {
    data: skills,
    isPending: isSkillsPending,
    isError: skillsError,
    error: skillsErrorObject,
  } = useTechnicianSkillSetQuery();
  const {
    data: ignoreLists,
    isPending: isIgnoreListsPending,
    isError: ignoreError,
    error: ignoreErrorObject,
  } = useTechnicianIgnoreListQuery();

  const unitsById = useMemo(
    () => new Map(units?.map((u) => [u.id, u]) ?? []),
    [units],
  );

  const issuesById = useMemo(
    () => new Map(specificIssues?.map((i) => [i.id, i]) ?? []),
    [specificIssues],
  );

  const selectedUnits = useMemo(() => {
    if (!units) return [];

    // Get selected unit Slugs
    const selectedSlugs = new Set(filter.unitSlugs);

    // Return a set from array of id's of selected Units
    return units.filter((unit) => selectedSlugs.has(unit.slug));
  }, [units, filter.unitSlugs]);

  const selectedUnitIds = useMemo(
    () => new Set(selectedUnits.map((unit) => unit.id)),
    [selectedUnits],
  );

  const selectedBrands = useMemo(() => {
    if (!brands) return [];

    // Get selected brands
    const selectedBrandSlugs = new Set(filter.brandSlugs);

    // Return a set of selected brands
    return brands.filter((brand) => selectedBrandSlugs.has(brand.slug));
  }, [brands, filter.brandSlugs]);

  const selectedBrandIds = useMemo(() => {
    return new Set(selectedBrands.map((b) => b.id));
  }, [selectedBrands]);

  const selectedBrandGroupIds = useMemo(() => {
    return new Set(selectedBrands.map((b) => b.group_id));
  }, [selectedBrands]);

  const selectedIssueSlugs = useMemo(
    () => new Set(filter.specificIssueSlugs),
    [filter.specificIssueSlugs],
  );

  // Get the set of selected issue ids and  map of issues unitId: issue
  const [selectedIssueIds, selectedIssueIdsByUnitId] = useMemo(() => {
    const issueIdsByUnit = new Map<string, Set<string>>();
    const activeIssueIds = new Set<string>();

    for (const issue of specificIssues ?? []) {
      if (!selectedIssueSlugs.has(issue.slug)) continue;

      activeIssueIds.add(issue.id);
      let unitIssues = issueIdsByUnit.get(issue.unit_id);
      if (!unitIssues) {
        unitIssues = new Set<string>();
        issueIdsByUnit.set(issue.unit_id, unitIssues);
      }

      unitIssues.add(issue.id);
    }

    return [activeIssueIds, issueIdsByUnit] as const;
  }, [specificIssues, selectedIssueSlugs]);

  // Create a skill map -  technicianId: skills for this technician
  const skillsByTechId = useMemo(
    () => createDataMapByTechnicianId(skills || []),
    [skills],
  );
  // Create an ignore map - technician Id: ignore list
  const ignoreListsByTechId = useMemo(
    () => createDataMapByTechnicianId(ignoreLists || []),
    [ignoreLists],
  );

  const isPending =
    isTechniciansPending ||
    isUnitsPending ||
    isBrandsPending ||
    isIssuesPending ||
    isSkillsPending ||
    isIgnoreListsPending;

  const isError =
    techniciansError ||
    unitsError ||
    brandsError ||
    specificIssuesError ||
    skillsError ||
    ignoreError;

  const error =
    techniciansErrorObject ??
    unitsErrorObject ??
    brandsErrorObject ??
    specificIssuesErrorObject ??
    skillsErrorObject ??
    ignoreErrorObject;

  const filteredTechnicians = useMemo(() => {
    if (
      isPending ||
      isError ||
      !technicians ||
      skillsByTechId.size === 0 ||
      ignoreListsByTechId.size === 0
    ) {
      return [];
    }

    return filterTechnicians({
      filter,
      technicians,
      skillsByTechId,
      selectedUnits,
      selectedUnitIds,
      selectedBrandIds,
      selectedBrandGroupIds,
      selectedIssueIds,
      selectedIssueIdsByUnitId,
      ignoreListsByTechId,
    });
  }, [
    filter,
    isPending,
    isError,
    technicians,
    skillsByTechId,
    selectedUnits,
    selectedUnitIds,
    selectedBrandIds,
    selectedBrandGroupIds,
    selectedIssueIds,
    selectedIssueIdsByUnitId,
    ignoreListsByTechId,
  ]);

  const technicianBadges = useMemo(() => {
    if (!technicians) return new Map<string, string[]>();

    return technicians?.reduce((badgesMap, technician) => {
      // Get boolean badges from technician card
      const technicianCapabilityBadges = [
        technician.gas && "Gas",
        technician.can_service_built_in && "Built-In",
        technician.can_service_stacked_dryer && "Stacked Dryer",
        technician.can_service_stacked_washer && "Stacked Washer",
        technician.commercial && "Commercial",
      ].filter(Boolean) as string[];

      // Get Skill Set by tech ID from map
      const techSkills = skillsByTechId.get(technician.id) || [];

      if (!badgesMap.get(technician.id)) badgesMap.set(technician.id, []);

      const specificBadges = techSkills.flatMap((skill) => {
        const currentBadges: string[] = [];

        const issue = issuesById.get(skill.specific_issue_id || "");
        if (issue && SPECIAL_ISSUE_SLUGS.has(issue.slug))
          currentBadges.push(issue.name);

        if (!skill.specific_issue_id) {
          const unit = unitsById.get(skill.unit_id || "");
          if (unit && SPECIAL_UNIT_SLUGS.has(unit.slug))
            currentBadges.push(unit.name);
        }
        return currentBadges;
      });

      const badges = Array.from(
        new Set([...technicianCapabilityBadges, ...specificBadges]),
      );

      return badgesMap.set(technician.id, badges);
    }, new Map<string, string[]>());
  }, [technicians, unitsById, issuesById, skillsByTechId]);

  return {
    filteredTechnicians,
    technicianBadges,
    isPending,
    isError,
    error,
  };
};
