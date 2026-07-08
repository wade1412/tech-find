import { useMemo } from "react";
import { useSpecificIssuesQuery } from "../../../../entities/specific-issue/useSpecificIssuesQuery";
import { useUnitsQuery } from "../../../../entities/unit/useUnitsQuery";
import { useTechnicianIgnoreListQuery } from "../../../../entities/technician-ignore-list/technicianIgnoreListQuery";
import { useBrandsQuery } from "../../../../entities/brand/useBrandsQuery";

export const useTechniciangIgnoreListEditorData = (technicianId: string) => {
  const {
    data: ignoreLists,
    isPending: isIgnorePending,
    isError: ignoreError,
    error: ignoreErrorObject,
  } = useTechnicianIgnoreListQuery();
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
    data: specificIssues,
    isPending: isSpecificIssuesPending,
    isError: isSpecificIssuesError,
    error: specificIssuesErrorObject,
  } = useSpecificIssuesQuery();

  const technicianIgnoreList = useMemo(
    () =>
      ignoreLists?.filter((list) => list.technician_id === technicianId) ?? [],
    [technicianId, ignoreLists],
  );

  // Map - unitId: unit
  const unitsById = useMemo(
    () => new Map(units?.map((u) => [u.id, u]) ?? []),
    [units],
  );
  // Map - brandGroupId: brandGroup
  const brandsById = useMemo(
    () => new Map(brands?.map((b) => [b.id, b]) ?? []),
    [brands],
  );
  // Map - issueId: issue
  const specificIssuesById = useMemo(
    () => new Map(specificIssues?.map((i) => [i.id, i]) ?? []),
    [specificIssues],
  );

  const isPending =
    isIgnorePending ||
    isUnitsPending ||
    isBrandsPending ||
    isSpecificIssuesPending;
  const isError =
    ignoreError || isUnitsError || isBrandsError || isSpecificIssuesError;
  const error =
    ignoreErrorObject ??
    unitsErrorObject ??
    brandsErrorObject ??
    specificIssuesErrorObject;

  return {
    technicianIgnoreList,
    units,
    unitsById,
    brands,
    brandsById,
    specificIssues,
    specificIssuesById,
    isPending,
    isError,
    error,
  };
};
