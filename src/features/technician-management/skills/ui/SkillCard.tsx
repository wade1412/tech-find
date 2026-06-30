import type { SkillDraft } from "../model/skills.types";

interface SkillCardProps {
  skill: SkillDraft;
  unitName: string | undefined;
  brandGroupName: string | undefined;
  specificIssueName: string | undefined;
}

function SkillCard({
  skill,
  unitName,
  brandGroupName,
  specificIssueName,
}: SkillCardProps) {
  const skillInfo = brandGroupName
    ? `${brandGroupName} brands`
    : specificIssueName
      ? `${specificIssueName}`
      : "Commercial";

  return (
    <div
      key={skill.key}
      className="flex items-center justify-between gap-4 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm shadow-sm dark:border-zinc-700/70 dark:bg-zinc-800/6"
    >
      <div className="flex flex-col gap-2">
        <span className="font-medium text-zinc-800 dark:text-zinc-100">
          {unitName || "Unit Name"}
        </span>

        <span className="truncate max-w-50 font-light text-zinc-800 dark:text-zinc-100">
          {skillInfo}
        </span>
      </div>

      <button
        type="button"
        disabled={false}
        className="-mr-1 inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-500 dark:hover:bg-red-950/30 dark:hover:text-red-400"
        aria-label={`Remove skill for ${unitName}`}
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
