import { useBrandsQuery } from "../../../entities/brand/useBrandsQuery";
import { useBrandGroupsQuery } from "../../../entities/brandGroup/useBrandGroupsQuery";
import { useServiceZonesQuery } from "../../../entities/service-zone/useServiceZonesQuery";
import { useSpecificIssuesQuery } from "../../../entities/specific-issue/useSpecificIssuesQuery";
import { useUnitsQuery } from "../../../entities/unit/useUnitsQuery";

export const useManageServicesData = () => {
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
    brands,
    brandGroups,
    specificIssues,
    zones,
    isPending,
    isError,
    error,
  };
};
