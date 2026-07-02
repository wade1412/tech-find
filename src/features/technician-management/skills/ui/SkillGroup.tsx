import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";
import type { SpecificIssue } from "../../../../entities/specific-issue/specific-issue.types";
import type { SkillDraft } from "../model/skills.types";
import SkillCard from "./SkillCard";

interface SkillGroupProps {
  isDisabled: boolean;
  unitName: string | undefined;
  skillDraftsForUnit: SkillDraft[] | undefined;
  brandGroupById: Map<string, BrandGroup>;
  specificIssuesById: Map<string, SpecificIssue>;
  onEditSkill: (skill: SkillDraft) => void;
  onRemoveSkill: (key: string) => void;
}

function SkillGroup({
  isDisabled,
  unitName,
  skillDraftsForUnit,
  brandGroupById,
  specificIssuesById,
  onEditSkill,
  onRemoveSkill,
}: SkillGroupProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm shadow-sm dark:border-zinc-700/70 dark:bg-zinc-800/6">
      <h2>{unitName || "Unknown Unit"}</h2>

      <div>
        {skillDraftsForUnit?.map((skill) => {
          const brandGroupName =
            skill.kind === "brandGroup"
              ? brandGroupById.get(skill.brandGroupId)?.name
              : undefined;

          const specificIssueName =
            skill.kind === "specificIssue"
              ? specificIssuesById.get(skill.specificIssueId)?.name
              : undefined;

          return (
            <SkillCard
              key={skill.key}
              isDisabled={isDisabled}
              skill={skill}
              brandGroupName={brandGroupName}
              specificIssueName={specificIssueName}
              onEditSkill={onEditSkill}
              onRemoveSkill={onRemoveSkill}
            />
          );
        })}
      </div>
    </div>
  );
}

export default SkillGroup;
