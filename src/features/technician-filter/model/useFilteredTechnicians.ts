import { useMemo } from "react";
import { useBrandsQuery } from "../../../entities/brand/useBrandsQuery";
import { useTechnicianIgnoreListQuery } from "../../../entities/technician-ignore-list/technicianIgnoreListQuery";
import { useTechnicianSkillSetQuery } from "../../../entities/technician-skill-set/technicianSkillSetQuery";
import { useTechniciansQuery } from "../../../entities/technician/useTechniciansQuery";
import { useUnitsQuery } from "../../../entities/unit/useUnitsQuery";
import { useTechnicianFilters } from "./useTechnicianFilters";
import { useSpecificIssuesQuery } from "../../../entities/specific-issue/useSpecificIssuesQuery";
import { filterTechnicians } from "./filterTechnicians";

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

  const selectedIssueSlugs = new Set(filter.specificIssueSlugs);

  // Get the map of issues unitId: issue
  const getIssuesMap = () => {
    const map = new Map<string, Set<string>>();

    for (const issue of specificIssues || []) {
      // Skip to the next issue if the current is not selected
      if (!selectedIssueSlugs.has(issue.slug)) continue;

      const ids = map.get(issue.unit_id) ?? new Set<string>();
      ids.add(issue.id);
      map.set(issue.unit_id, ids);
    }

    return map;
  };

  const selectedIssueIdsByUnitId = getIssuesMap();

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
      return technicians;
    }

    return filterTechnicians({
      filter,
      technicians,
      skills,
      selectedUnits,
      selectedUnitIds,
      selectedBrandIds,
      selectedBrandGroupIds,
      selectedIssueIdsByUnitId,
      ignoreLists,
    });
  }, [
    filter,
    isPending,
    isError,
    technicians,
    skills,
    selectedUnits,
    selectedUnitIds,
    selectedBrandIds,
    selectedBrandGroupIds,
    selectedIssueIdsByUnitId,
    ignoreLists,
  ]);

  return {
    filteredTechnicians,
    isPending,
    isError,
    error,
  };
};
