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
