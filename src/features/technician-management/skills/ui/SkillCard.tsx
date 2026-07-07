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
    <div className="group flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
      <span className="min-w-0 flex-1 truncate px-1  font-normal text-zinc-800 dark:text-zinc-100">
        {skillInfo[skill.kind]}
      </span>

      <button
        type="button"
        disabled={isDisabled}
        onClick={() => onEditSkill(skill)}
        className="focus-visible:ring-main-500 inline-flex h-8 cursor-pointer items-center justify-center rounded-lg px-3 text-xs font-semibold text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-zinc-700/60 dark:hover:text-zinc-100"
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
