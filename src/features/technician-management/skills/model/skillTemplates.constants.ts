import type { SkillTemplateDefinition } from "./skillTemplates.types";

export const SKILL_TEMPLATES = [
  {
    id: "all-standard",
    label: "All standard",
    brandGroupSlug: "standard",
  },
  {
    id: "all-high-end",
    label: "All High End",
    brandGroupSlug: "high-end",
  },
] as const satisfies readonly SkillTemplateDefinition[];
