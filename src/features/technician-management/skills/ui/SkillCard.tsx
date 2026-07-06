import { secondaryButton } from "../../../../shared/styles/styles";
import DeleteButton from "../../../../shared/ui/DeleteButton";
import type { SkillDraft } from "../model/skills.types";

interface SkillCardProps {
  isDisabled: boolean;
  skill: SkillDraft;
  brandGroupName: string | undefined;
  specificIssueName: string | undefined;
  onEditSkill: (skill: SkillDraft) => void;
  onRemoveSkill: (skillId: string) => void;
}

function SkillCard({
  isDisabled,
  skill,
  brandGroupName,
  specificIssueName,
  onEditSkill,
  onRemoveSkill,
}: SkillCardProps) {
  const skillInfo = {
    commercial: "Commercial",
    brandGroup: brandGroupName ?? "Unknown brand group",
    specificIssue: specificIssueName ?? "Unknown specific issue",
  };

  return (
    <div className="group flex items-center gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
      <span className="min-w-0 flex-1 px-1 truncate font-medium text-zinc-800 dark:text-zinc-100">
        {skillInfo[skill.kind]}
      </span>

      <button
        type="button"
        disabled={isDisabled}
        onClick={() => onEditSkill(skill)}
        className={`${secondaryButton} p-2! py-1! `}
      >
        Edit
      </button>

      <DeleteButton
        label={skillInfo[skill.kind]}
        isDisabled={isDisabled}
        onDelete={() => onRemoveSkill(skill.key)}
      />
    </div>
  );
}

export default SkillCard;
