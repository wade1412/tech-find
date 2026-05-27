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

  const specificIssueIds = useMemo(() => {
    if (!specificIssues) return new Set<string>();

    // Get selected specific issues
    const selectedIssuesSlugs = new Set(filter.specificIssueSlugs);

    return new Set(
      specificIssues
        .filter((issue) => selectedIssuesSlugs.has(issue.slug))
        .map((issue) => issue.id),
    );
  }, [specificIssues, filter.specificIssueSlugs]);

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
      selectedBrands,
      selectedBrandIds,
      selectedBrandGroupIds,
      specificIssueIds,
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
    selectedBrands,
    selectedBrandIds,
    selectedBrandGroupIds,
    specificIssueIds,
    ignoreLists,
  ]);

  return {
    filteredTechnicians,
    isPending,
    isError,
    error,
  };
};
