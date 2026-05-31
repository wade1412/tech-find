import type { JobOptionKey } from "./filter.types";

export const filterCheckboxes: JobOptionKey[] = [
  "stacked",
  "gas",
  "commercial",
];

export const SPECIAL_UNIT_SLUGS = new Set([
  "dryer-vent-line",
  "ice-maker-standalone",
  "vent-hood",
  "microwave",
  "water-heater",
]);

export const SPECIAL_ISSUE_SLUGS = new Set([
  "compressor-repair",
  "freon-recharge",
]);

export const ISSUE_BADGE_LABELS: Record<string, string> = {
  "compressor-repair": "Compressor Replacement",
};
