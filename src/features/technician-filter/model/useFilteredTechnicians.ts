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
  } = useTechniciansQuery();
  const {
    data: units,
    isPending: isUnitsPending,
    isError: unitsError,
  } = useUnitsQuery();
  const {
    data: brands,
    isPending: isBrandsPending,
    isError: brandsError,
  } = useBrandsQuery();
  const {
    data: specificIssues,
    isPending: isIssuesPending,
    isError: specificIssuesError,
  } = useSpecificIssuesQuery();
  const {
    data: skills,
    isPending: isSkillsPending,
    isError: technicianSkillsError,
  } = useTechnicianSkillSetQuery();
  const {
    data: ignoreLists,
    isPending: isIgnoreListsPending,
    isError: techniciansIgnoreError,
  } = useTechnicianIgnoreListQuery();

  const selectedUnitIds = useMemo(() => {
    if (!units) return new Set<string>();

    // Get selected unit Slugs
    const selectedSlugs = new Set(filter.unitSlugs);

    // Return a set from array of id's of selected Units
    return new Set(
      units
        .filter((unit) => selectedSlugs.has(unit.slug))
        .map((unit) => unit.id),
    );
  }, [units, filter.unitSlugs]);

  const selectedBrands = useMemo(() => {
    if (!brands) return [];

    // Get selected brands
    const selectedBrandSlugs = new Set(filter.brandSlugs);

    // Return a set of selected brands
    return brands.filter((brand) => selectedBrandSlugs.has(brand.slug));
  }, [brands, filter.brandSlugs]);

  const selectedBrandIds = useMemo(() => {
    return selectedBrands.map((b) => b.id);
  }, [selectedBrands]);

  const selectedBrandGroupIds = useMemo(() => {
    return selectedBrands.map((b) => b.group_id);
  }, [selectedBrands]);

  const specificIssueIds = useMemo(() => {
    if (!specificIssues) return [];

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
    technicianSkillsError ||
    techniciansIgnoreError;

  const filteredTechnicians = useMemo(() => {
    if (isPending || isError || !technicians || !skills || !ignoreLists) {
      return technicians;
    }

    return filterTechnicians({
      technicians,
      skills,
      ignoreLists,
      selectedUnitIds,
    });
  }, [isPending, isError, technicians, skills, ignoreLists, selectedUnitIds]);

  return {
    filteredTechnicians,
    isPending,
    isError,
  };
};
