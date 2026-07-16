import { useMemo } from "react";
import { useBrandsQuery } from "../../../../entities/brand/useBrandsQuery";
import { useBrandGroupsQuery } from "../../../../entities/brandGroup/useBrandGroupsQuery";
import { useSpecificIssuesQuery } from "../../../../entities/specific-issue/useSpecificIssuesQuery";
import { useUnitsQuery } from "../../../../entities/unit/useUnitsQuery";
import { useServiceZonesQuery } from "../../../../entities/service-zone/useServiceZonesQuery";

export const useNewTechnicianData = () => {
  const {
    data: units,
    isPending: isUnitsPending,
    isError: isUnitsError,
    error: unitsErrorObject,
  } = useUnitsQuery();
  const {
    data: brands,
    isPending: isBrandsPending,
    isError: isBrandsError,
    error: brandsErrorObject,
  } = useBrandsQuery();
  const {
    data: brandGroups,
    isPending: isBrandGroupsPending,
    isError: isBrandGroupsError,
    error: brandGroupsErrorObject,
  } = useBrandGroupsQuery();
  const {
    data: specificIssues,
    isPending: isSpecificIssuesPending,
    isError: isSpecificIssuesError,
    error: specificIssuesErrorObject,
  } = useSpecificIssuesQuery();
  const {
    data: zones,
    isPending: isZonesPending,
    isError: isZonesError,
    error: zonesErrorObject,
  } = useServiceZonesQuery();

  // Map - unitId: unit
  const unitsById = useMemo(
    () => new Map(units?.map((u) => [u.id, u]) ?? []),
    [units],
  );
  // Map - brandId: brand
  const brandsById = useMemo(
    () => new Map(brands?.map((b) => [b.id, b]) ?? []),
    [brands],
  );
  // Map - brandGroupId: brandGroup
  const brandGroupById = useMemo(
    () => new Map(brandGroups?.map((b) => [b.id, b]) ?? []),
    [brandGroups],
  );
  // Map - issueId: issue
  const specificIssuesById = useMemo(
    () => new Map(specificIssues?.map((i) => [i.id, i]) ?? []),
    [specificIssues],
  );

  const isPending =
    isUnitsPending ||
    isBrandsPending ||
    isBrandGroupsPending ||
    isSpecificIssuesPending ||
    isZonesPending;
  const isError =
    isUnitsError ||
    isBrandsError ||
    isBrandGroupsError ||
    isSpecificIssuesError ||
    isZonesError;
  const error =
    unitsErrorObject ??
    brandsErrorObject ??
    brandGroupsErrorObject ??
    specificIssuesErrorObject ??
    zonesErrorObject;

  return {
    units,
    unitsById,
    brands,
    brandsById,
    brandGroups,
    brandGroupById,
    specificIssues,
    specificIssuesById,
    zones,
    isPending,
    isError,
    error,
  };
};
