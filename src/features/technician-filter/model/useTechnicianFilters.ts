import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";
import type { FilterState, JobOptionKey } from "./filter.types";

type FilterParamKey =
  | "units"
  | "brands"
  | "specific_issues"
  | "stacked"
  | "commercial"
  | "gas"
  | "sort";

type SlugArrayParamKey = "brands" | "specific_issues";

export const useTechnicianFilters = () => {
  const [filterParams, setFilterParams] = useSearchParams();

  const filter: FilterState = useMemo(() => {
    const unitsParam = filterParams.get("units");
    const brandsParam = filterParams.get("brands");
    const specificIssuesParam = filterParams.get("specific_issues");
    const sortParam = filterParams.get("sort");
    return {
      unitSlugs: unitsParam
        ? [...new Set(unitsParam.split(",").filter(Boolean))]
        : [],
      isGas: filterParams.get("gas") === "1",
      isStacked: filterParams.get("stacked") === "1",
      isCommercial: filterParams.get("commercial") === "1",
      brandSlugs: brandsParam
        ? [...new Set(brandsParam.split(",").filter(Boolean))]
        : [],
      specificIssueSlugs: specificIssuesParam
        ? [...new Set(specificIssuesParam.split(",").filter(Boolean))]
        : [],
      sort: sortParam ? sortParam : "default.asc",
    };
  }, [filterParams]);

  // Universal function to update a filter
  const updateFilter = useCallback(
    (key: FilterParamKey, value: string | null | undefined) => {
      // New params to avoid mutations
      const newParams = new URLSearchParams(filterParams);

      if (value == null || value === "") {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }

      setFilterParams(newParams, { replace: true });
    },
    [filterParams, setFilterParams],
  );

  // -------- Update Filter Options --------

  const updateSlugsArray = useCallback(
    (key: SlugArrayParamKey, newValue: string[]) => {
      const uniqueSlugs = [...new Set(newValue)];
      updateFilter(key, uniqueSlugs.length > 0 ? uniqueSlugs.join(",") : null);
    },
    [updateFilter],
  );

  // Update specific issue slugs array
  const updateSpecificIssueSlugs = useCallback(
    (newValue: string[]) => updateSlugsArray("specific_issues", newValue),
    [updateSlugsArray],
  );

  // Update brand Slugs array
  const updateBrandSlugs = useCallback(
    (newValue: string[]) => updateSlugsArray("brands", newValue),
    [updateSlugsArray],
  );

  // Update Sort option
  const updateSort = useCallback(
    (newValue: string) => {
      updateFilter("sort", newValue);
    },
    [updateFilter],
  );

  // -------- Toggle Filter Options --------

  // Toggle Unit from a units Array
  const toggleUnit = useCallback(
    (unitSlug: string) => {
      const currentUnitSlugs = filter.unitSlugs;

      const newUnits = currentUnitSlugs.includes(unitSlug)
        ? currentUnitSlugs.filter((unit) => unit !== unitSlug)
        : [...currentUnitSlugs, unitSlug];

      // If newUnits array is empty pass null to delete the key from params
      updateFilter("units", newUnits.length > 0 ? newUnits.join(",") : null);
    },
    [filter.unitSlugs, updateFilter],
  );

  // Toggle Stacked option
  const toggleStacked = useCallback(() => {
    updateFilter("stacked", filter.isStacked ? null : "1");
  }, [filter.isStacked, updateFilter]);

  // Toggle Gas option
  const toggleGas = useCallback(() => {
    updateFilter("gas", filter.isGas ? null : "1");
  }, [filter.isGas, updateFilter]);

  // Toggle Commercial option - has to disable selected brands
  const toggleCommercial = useCallback(() => {
    const newParams = new URLSearchParams(filterParams);

    if (filter.isCommercial) {
      newParams.delete("commercial");
    } else {
      newParams.set("commercial", "1");
      newParams.delete("brands");
    }

    setFilterParams(newParams, { replace: true });
  }, [filter.isCommercial, filterParams, setFilterParams]);

  // -------- Clear Filter Options --------

  const clearOptionByKeys = useCallback(
    (keysArr: JobOptionKey[]) => {
      if (keysArr.length === 0) return;

      const newParams = new URLSearchParams(filterParams);
      keysArr.forEach((key) => newParams.delete(key));
      setFilterParams(newParams, { replace: true });
    },
    [filterParams, setFilterParams],
  );

  const clearUnits = useCallback(() => {
    updateFilter("units", null);
  }, [updateFilter]);

  const resetFilters = useCallback(() => {
    setFilterParams({});
  }, [setFilterParams]);

  return {
    filter,
    updateBrandSlugs,
    updateSpecificIssueSlugs,
    updateSort,
    toggleUnit,
    clearUnits,
    toggleStacked,
    toggleCommercial,
    toggleGas,
    clearOptionByKeys,
    resetFilters,
  };
};
