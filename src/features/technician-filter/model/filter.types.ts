export type FilterState = {
  unitSlugs: string[];
  brandSlugs: string[];
  isGas: boolean;
  isCommercial: boolean;
  isStacked: boolean;
};

export type JobOptionKey = "gas" | "stacked" | "commercial";
