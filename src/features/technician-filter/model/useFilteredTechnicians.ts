import { useMemo } from "react";
import { useBrandsQuery } from "../../../entities/brand/useBrandsQuery";
import { useTechnicianIgnoreListQuery } from "../../../entities/technician-ignore-list/technicianIgnoreListQuery";
import { useTechnicianSkillSetQuery } from "../../../entities/technician-skill-set/technicianSkillSetQuery";
import { useTechniciansQuery } from "../../../entities/technician/useTechniciansQuery";
import { useUnitsQuery } from "../../../entities/unit/useUnitsQuery";
import { useTechnicianFilters } from "./useTechnicianFilters";
import { useSpecificIssuesQuery } from "../../../entities/specific-issue/useSpecificIssuesQuery";
import { filterTechnicians } from "./filterTechnicians";
import {
  ISSUE_BADGE_LABELS,
  SPECIAL_ISSUE_SLUGS,
  SPECIAL_UNIT_SLUGS,
} from "./filter.constants";
import { useBrandGroupsQuery } from "../../../entities/brandGroup/useBrandGroupsQuery";
import { useServiceZonesQuery } from "../../../entities/service-zone/useServiceZonesQuery";
import { useTechnicianServiceZonesQuery } from "../../../entities/technician-service-zone/useTechnicianServiceZonesQuery";
import {
  createTechnicianZoneNamesMap,
  createZoneIdMapByTechId,
} from "../../../entities/technician-service-zone/technician-service-zone.helpers";
import { createDataMapByTechnicianId } from "./filter.helpers";

export const useFilteredTechnicians = () => {
  // --- Queries ---
  const { filter } = useTechnicianFilters();
  const {
    data: technicians,
    isPending: isTechniciansPending,
    isError: techniciansError,
    error: techniciansErrorObject,
  } = useTechniciansQuery();
  const {
    data: zones,
    isPending: isZonesPending,
    isError: isZonesError,
    error: zonesErrorObject,
  } = useServiceZonesQuery();
  const {
    data: technicianZones,
    isPending: isTechnicianZonesPending,
    isError: isTechnicianZonesError,
    error: technicianZonesErrorObject,
  } = useTechnicianServiceZonesQuery();
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
  const { data: brandGroups } = useBrandGroupsQuery();
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

  // --- Filtering Maps and Inputs ---

  // 1) General Maps:
  // Map -  technicianId: zones
  const zonesByTechId = useMemo(
    () => createZoneIdMapByTechId(technicianZones ?? []),
    [technicianZones],
  );
  // Map - unitId: unit
  const unitsById = useMemo(
    () => new Map(units?.map((u) => [u.id, u]) ?? []),
    [units],
  );
  // Map - issueId: issue
  const issuesById = useMemo(
    () => new Map(specificIssues?.map((i) => [i.id, i]) ?? []),
    [specificIssues],
  );

  // 2) Technician Maps:
  // Map -  technicianId: technicanSkills
  const skillsByTechId = useMemo(
    () => createDataMapByTechnicianId(skills || []),
    [skills],
  );
  // Map - technician Id: ignore list
  const ignoreListsByTechId = useMemo(
    () => createDataMapByTechnicianId(ignoreLists || []),
    [ignoreLists],
  );

  // 3) Array inputs
  // Input - selected units array
  const selectedUnits = useMemo(() => {
    if (!units) return [];

    // Get selected unit Slugs
    const selectedSlugs = new Set(filter.unitSlugs);

    // Return a set from array of id's of selected Units
    return units.filter((unit) => selectedSlugs.has(unit.slug));
  }, [units, filter.unitSlugs]);
  // Input - selected brands array
  const selectedBrands = useMemo(() => {
    if (!brands) return [];

    // Get selected brands
    const selectedBrandSlugs = new Set(filter.brandSlugs);

    // Return a set of selected brands
    return brands.filter((brand) => selectedBrandSlugs.has(brand.slug));
  }, [brands, filter.brandSlugs]);

  // 4) Set inputs
  // Input - set of selected unit Ids
  const selectedUnitIds = useMemo(
    () => new Set(selectedUnits.map((unit) => unit.id)),
    [selectedUnits],
  );
  // Input - set of selected brand Ids
  const selectedBrandIds = useMemo(() => {
    return new Set(selectedBrands.map((b) => b.id));
  }, [selectedBrands]);
  // Input - set of selected brand group Ids
  const selectedBrandGroupIds = useMemo(() => {
    return new Set(selectedBrands.map((b) => b.group_id));
  }, [selectedBrands]);
  // Input - set of selected Issue slugs
  const selectedIssueSlugs = useMemo(
    () => new Set(filter.specificIssueSlugs),
    [filter.specificIssueSlugs],
  );

  // 5) Other inputs:
  // Input - Set of selected issue ids and  map of issues by unitId: issue
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
  // Input - selected Zone Id string
  const selectedZoneId = useMemo(
    () => zones?.find((z) => z.slug === filter.zone)?.id || "",
    [zones, filter.zone],
  );

  // --- Data Filtering ---
  const isPending =
    isTechniciansPending ||
    isZonesPending ||
    isTechnicianZonesPending ||
    isUnitsPending ||
    isBrandsPending ||
    isIssuesPending ||
    isSkillsPending ||
    isIgnoreListsPending;

  const isError =
    techniciansError ||
    isZonesError ||
    isTechnicianZonesError ||
    unitsError ||
    brandsError ||
    specificIssuesError ||
    skillsError ||
    ignoreError;

  const error =
    techniciansErrorObject ??
    zonesErrorObject ??
    technicianZonesErrorObject ??
    unitsErrorObject ??
    brandsErrorObject ??
    specificIssuesErrorObject ??
    skillsErrorObject ??
    ignoreErrorObject;

  const filteredTechnicians = useMemo(() => {
    if (isPending || isError || !technicians) {
      return [];
    }

    return filterTechnicians({
      filter,
      technicians,
      zonesByTechId,
      skillsByTechId,
      selectedZoneId,
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
    zonesByTechId,
    skillsByTechId,
    selectedZoneId,
    selectedUnits,
    selectedUnitIds,
    selectedBrandIds,
    selectedBrandGroupIds,
    selectedIssueIds,
    selectedIssueIdsByUnitId,
    ignoreListsByTechId,
  ]);

  // --- Presentation Maps ---

  // Map - technicianId: zones that he covers
  const technicianZonesNames = useMemo(
    () =>
      createTechnicianZoneNamesMap(
        zones ?? [],
        technicianZones ?? [],
        zonesByTechId,
      ),
    [zones, technicianZones, zonesByTechId],
  );
  // Map - technicianId: skill badges
  const technicianBadges = useMemo(() => {
    if (!technicians) return new Map<string, string[]>();

    const highEndGroup = brandGroups?.find(
      (group) => group.slug === "high-end",
    );
    const highEndGroupId = highEndGroup?.id;

    return technicians.reduce((badgesMap, technician) => {
      // Get Skill Set by tech ID from map
      const techSkills = skillsByTechId.get(technician.id) ?? [];

      const hasHighEndSkill =
        highEndGroupId &&
        techSkills.some((skill) => skill.brand_group_id === highEndGroupId);

      // Get boolean badges from technician card
      const technicianCapabilityBadges = [
        technician.gas && "Gas",
        technician.can_service_built_in && "Built-In",
        technician.can_service_stacked_dryer && "Stacked Dryer",
        technician.can_service_stacked_washer && "Stacked Washer",
        technician.commercial && "Commercial",
        hasHighEndSkill && "High-End",
      ].filter(Boolean) as string[];

      const skillBadges = techSkills.flatMap((skill) => {
        const currentBadges: string[] = [];

        const issue = issuesById.get(skill.specific_issue_id ?? "");
        if (issue && SPECIAL_ISSUE_SLUGS.has(issue.slug))
          currentBadges.push(ISSUE_BADGE_LABELS[issue.slug] ?? issue.name);

        if (!skill.specific_issue_id) {
          const unit = unitsById.get(skill.unit_id ?? "");
          if (unit && SPECIAL_UNIT_SLUGS.has(unit.slug))
            currentBadges.push(unit.name);
        }
        return currentBadges;
      });

      const badges = Array.from(
        new Set([...technicianCapabilityBadges, ...skillBadges]),
      );

      return badgesMap.set(technician.id, badges);
    }, new Map<string, string[]>());
  }, [technicians, brandGroups, unitsById, issuesById, skillsByTechId]);

  return {
    filteredTechnicians,
    technicianZonesNames,
    technicianBadges,
    isPending,
    isError,
    error,
  };
};
