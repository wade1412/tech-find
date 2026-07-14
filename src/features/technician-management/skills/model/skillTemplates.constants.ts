import type { SkillTemplateDefinition } from "./skillTemplates.types";

export const SKILL_TEMPLATES = [
  {
    id: "all-standard",
    label: "Standard — All Units",
    brandGroupSlug: "standard",
  },
  {
    id: "all-high-end",
    label: "High-End — All Units",
    brandGroupSlug: "high-end",
  },
] as const satisfies readonly SkillTemplateDefinition[];
