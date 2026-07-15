import type { SkillDraft } from "./skills.types";

export type SkillTemplateDefinition = {
  id: "all-standard" | "all-high-end";
  label: string;
  brandGroupSlug: string;
  includedUnitSlugs: ReadonlySet<string>;
};

export type SkillTemplateAvailability =
  | {
      status: "available";
      totalCount: number;
      missingCount: number;
    }
  | {
      status: "unavailable";
      error: string;
    };

export type ApplySkillTemplateResult =
  | {
      success: true;
      skills: SkillDraft[];
      addedCount: number;
      skippedCount: number;
    }
  | {
      success: false;
      error: string;
    };
