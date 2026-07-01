import type { NewSkillInput } from "../../../../entities/technician-skill-set/technicianSkillSet.types";

export type SkillDraft =
  | { key: string; sourceId: string | null; unitId: string; kind: "commercial" }
  | {
      key: string;
      sourceId: string | null;
      unitId: string;
      kind: "brandGroup";
      brandGroupId: string;
    }
  | {
      key: string;
      sourceId: string | null;
      unitId: string;
      kind: "specificIssue";
      specificIssueId: string;
    };

export type SkillsPatch = {
  addedSkills: NewSkillInput[];
  removedSkillIds: string[];
};
