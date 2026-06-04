import type { FilterState } from "./filter.types";

export const createTechnicianFilterKey = (filter: FilterState): string => {
  return [
    filter.unitSlugs.join(","),
    filter.brandSlugs.join(","),
    filter.specificIssueSlugs.join(","),
    filter.isGas ? "gas:1" : "gas:0",
    filter.isStacked ? "stacked:1" : "stacked:0",
    filter.isCommercial ? "commercial:1" : "commercial:0",
  ].join("|");
};
