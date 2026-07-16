import type { SkillTemplateDefinition } from "./skillTemplates.types";

const BASIC_UNIT_SLUGS: ReadonlySet<string> = new Set([
  "dishwasher",
  "dryer",
  "fridge",
  "washer",
  "stove-range",
  "garbage-disposal",
]);

export const SKILL_TEMPLATES = [
  {
    id: "all-standard",
    label: "Standard Brands — Basic Units",
    brandGroupSlug: "standard",
    includedUnitSlugs: BASIC_UNIT_SLUGS,
  },
  {
    id: "all-high-end",
    label: "High-End Brands — Basic Units",
    brandGroupSlug: "high-end",
    includedUnitSlugs: BASIC_UNIT_SLUGS,
  },
] as const satisfies readonly SkillTemplateDefinition[];
