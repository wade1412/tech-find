import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";
import type { SpecificIssue } from "../../../../entities/specific-issue/specific-issue.types";
import { skillGroupTitleStyle } from "../../../../shared/styles/styles";
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
    <div className="mb-3 break-inside-avoid rounded-xl border border-zinc-200 bg-white text-sm dark:border-zinc-800 dark:bg-zinc-900/60">
      <h2 className={skillGroupTitleStyle}>{unitName ?? "Unknown Unit"}</h2>

      <div className="flex flex-col gap-1.5 divide-y divide-zinc-100 p-2 dark:divide-zinc-800">
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
