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

const SPECIAL_UNIT_SLUGS = new Set([
  "dryer-vent-line",
  "ice-maker-standalone",
  "vent-hood",
  "microwave",
  "water-heater",
]);

const SPECIAL_ISSUE_SLUGS = new Set(["compressor-repair", "freon-recharge"]);

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
  const skillsByTechId = createDataMapByTechnicianId(skills || []);

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
    if (isPending || isError || !technicians || !skills || !ignoreLists) {
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
      ignoreLists,
    });
  }, [
    filter,
    isPending,
    isError,
    technicians,
    skills,
    skillsByTechId,
    selectedUnits,
    selectedUnitIds,
    selectedBrandIds,
    selectedBrandGroupIds,
    selectedIssueIds,
    selectedIssueIdsByUnitId,
    ignoreLists,
  ]);

  const technicianBadges = useMemo(() => {
    return technicians?.reduce((badgesMap, technician) => {
      // Get boolean skills from technician card
      const specificSkillsBooleans = [
        technician.gas && "Gas",
        technician.can_service_built_in && "Built-In",
        technician.can_service_stacked_dryer && "Stacked Dryer",
        technician.can_service_stacked_washer && "Stacked Washer",
        technician.commercial && "Commercial",
      ].filter(Boolean) as string[];

      // Get Skill Set by tech ID from map
      const techSkills = skillsByTechId[technician.id] || [];

      if (!badgesMap.get(technician.id)) badgesMap.set(technician.id, []);

      const badges = new Set([
        ...techSkills.map((skill) => {
          if (skill.specific_issue_id) {
            const match = specificIssues?.find(
              (issue) => issue.id === skill.specific_issue_id,
            );

            if (match && SPECIAL_ISSUE_SLUGS.has(match.slug)) return match.name;
          }

          if (skill.unit_id) {
            const match = units?.find((unit) => unit.id === skill.unit_id);

            if (match && SPECIAL_UNIT_SLUGS.has(match.slug)) return match.name;
          }
        }),
        ...specificSkillsBooleans,
      ]);

      return badgesMap.set(technician.id, badges);
    }, new Map());
  }, [technicians, units, specificIssues, skillsByTechId]);

  return {
    filteredTechnicians,
    technicianBadges,
    isPending,
    isError,
    error,
  };
};
