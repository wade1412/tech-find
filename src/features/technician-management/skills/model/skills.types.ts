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

export type NewSkillInput = {
  brand_group_id: string | null;
  commercial: boolean;
  specific_issue_id: string | null;
  technician_id: string;
  unit_id: string;
};

export type SkillsPatch = {
  addedSkills: NewSkillInput[];
  removedSkillIds: string[];
};
