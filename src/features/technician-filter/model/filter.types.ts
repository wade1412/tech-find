export type FilterState = {
  unitSlugs: string[];
  brandSlugs: string[];
  specificIssueSlugs: string[];
  isGas: boolean;
  isCommercial: boolean;
  isStacked: boolean;
};

export type JobOptionKey = "gas" | "stacked" | "commercial";
