import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";
import type { FilterState } from "./filter.types";

type FilterParamKey = "units" | "stacked" | "commercial" | "gas";
type FilterOptionKey = Exclude<FilterParamKey, "units">;

const filterCheckboxes: FilterOptionKey[] = ["stacked", "commercial", "gas"];

export const useTechnicianFilters = () => {
  const [filterParams, setFilterParams] = useSearchParams();

  const filter: FilterState = useMemo(() => {
    const unitsParam = filterParams.get("units");
    return {
      unitSlugs: unitsParam
        ? [...new Set(unitsParam.split(",").filter(Boolean))]
        : [],
      isGas: filterParams.get("gas") === "1",
      isStacked: filterParams.get("stacked") === "1",
      isCommercial: filterParams.get("commercial") === "1",
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

  // Toggle Commercial option
  const toggleCommercial = useCallback(() => {
    updateFilter("commercial", filter.isCommercial ? null : "1");
  }, [filter.isCommercial, updateFilter]);

  // Toggle Gas option
  const toggleGas = useCallback(() => {
    updateFilter("gas", filter.isGas ? null : "1");
  }, [filter.isGas, updateFilter]);

  // -------- Clear Filter Options --------

  const clearFilterOption = useCallback(
    (key: FilterOptionKey) => updateFilter(key, null),
    [updateFilter],
  );

  const clearStacked = useCallback(() => {
    clearFilterOption("stacked");
  }, [clearFilterOption]);

  const clearCommercial = useCallback(() => {
    clearFilterOption("commercial");
  }, [clearFilterOption]);

  const clearGas = useCallback(() => {
    clearFilterOption("gas");
  }, [clearFilterOption]);

  // Clear all checkboxes
  const clearOptions = useCallback(() => {
    const newParams = new URLSearchParams(filterParams);
    filterCheckboxes.forEach((c) => newParams.delete(c));

    setFilterParams(newParams, { replace: true });
  }, [filterParams, setFilterParams]);

  const clearUnits = useCallback(() => {
    updateFilter("units", null);
  }, [updateFilter]);

  return {
    filter,
    toggleUnit,
    clearUnits,
    toggleStacked,
    toggleCommercial,
    toggleGas,
    clearStacked,
    clearCommercial,
    clearGas,
    clearOptions,
  };
};
