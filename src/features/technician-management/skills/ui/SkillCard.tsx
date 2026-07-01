import type { SkillDraft } from "../model/skills.types";

interface SkillCardProps {
  skill: SkillDraft;
  brandGroupName: string | undefined;
  specificIssueName: string | undefined;
}

function SkillCard({
  skill,
  brandGroupName,
  specificIssueName,
}: SkillCardProps) {
  const skillInfo = {
    commercial: "Commercial",
    brandGroup: brandGroupName ?? "Unknown brand group",
    specificIssue: specificIssueName ?? "Unknown specific issue",
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <span className="truncate max-w-50 font-light text-zinc-800 dark:text-zinc-100">
        {skillInfo[skill.kind]}
      </span>

      <button
        type="button"
        disabled={false}
        className="-mr-1 inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-500 dark:hover:bg-red-950/30 dark:hover:text-red-400"
        aria-label={`Remove ${skillInfo[skill.kind]} skill`}
        onClick={() => {}}
      >
        <svg
          className="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}

export default SkillCard;
