import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";

export const useTechnicianFilters = () => {
  const [filterParams, setFilterParams] = useSearchParams();

  const filter = useMemo(() => {
    const unitsParam = filterParams.get("units");
    return {
      unitSlugs: unitsParam ? unitsParam.split(",") : [],
      isStacked: filterParams.get("stacked") === "1",
      isCommercial: filterParams.get("commercial") === "1",
    };
  }, [filterParams]);

  // Universal function to update a filter
  const updateFilter = useCallback(
    (key: string, value: string | null | undefined) => {
      // New params to avoid mutations
      const newParams = new URLSearchParams(filterParams);

      if (!value || value === "null") {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }

      setFilterParams(newParams, { replace: true });
    },
    [filterParams, setFilterParams],
  );

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
    const prev = filterParams.get("stacked");
    updateFilter("stacked", prev === "1" ? null : "1");
  }, [filterParams, updateFilter]);

  // Toggle Commercial option
  const toggleCommercial = useCallback(() => {
    const prev = filterParams.get("commercial");
    updateFilter("commercial", prev === "1" ? null : "1");
  }, [filterParams, updateFilter]);

  // Clear checkboxes
  const clearOptions = useCallback(() => {
    updateFilter("stacked", null);
    updateFilter("commercial", null);
  }, [updateFilter]);

  const clearUnits = useCallback(() => {
    updateFilter("units", null);
  }, [updateFilter]);

  return {
    filter,
    toggleUnit,
    clearUnits,
    toggleStacked,
    toggleCommercial,
    clearOptions,
  };
};
