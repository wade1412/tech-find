import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";
import type { FilterState, JobOptionKey } from "./filter.types";
import { filterCheckboxes } from "./filter.constants";

type FilterParamKey = "units" | "brands" | "stacked" | "commercial" | "gas";

export const useTechnicianFilters = () => {
  const [filterParams, setFilterParams] = useSearchParams();

  const filter: FilterState = useMemo(() => {
    const unitsParam = filterParams.get("units");
    const brandsParam = filterParams.get("brands");
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

  const updateBrandSlugs = useCallback(
    (newValue: string[]) => {
      updateFilter("brands", newValue.length > 0 ? newValue.join(",") : null);
    },
    [updateFilter],
  );

  const clearBrands = useCallback(() => {
    updateFilter("brands", null);
  }, [updateFilter]);

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

  // Toggle Commercial option
  const toggleCommercial = useCallback(() => {
    updateFilter("commercial", filter.isCommercial ? null : "1");
  }, [filter.isCommercial, updateFilter]);

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

  // Clear all checkboxes
  const clearAllOptions = useCallback(
    () => clearOptionByKeys(filterCheckboxes),
    [clearOptionByKeys],
  );

  const clearUnits = useCallback(() => {
    updateFilter("units", null);
  }, [updateFilter]);

  return {
    filter,
    updateBrandSlugs,
    clearBrands,
    toggleUnit,
    clearUnits,
    toggleStacked,
    toggleCommercial,
    toggleGas,
    clearOptionByKeys,
    clearAllOptions,
  };
};
