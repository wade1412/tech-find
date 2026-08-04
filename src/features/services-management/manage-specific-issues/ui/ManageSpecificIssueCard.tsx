import { Link } from "react-router";
import type { SpecificIssue } from "../../../../entities/specific-issue/specific-issue.types";
import type { Unit } from "../../../../entities/unit/unit.types";
import {
  cardTagStyle,
  manageItemCardCointainerStyle,
} from "../../../../shared/styles/styles";
import { isSpecificIssueEffectivelyActive } from "../model/filterSpecificIssues";

interface ManageSpecificIssueCardProps {
  specificIssue: SpecificIssue;
  unit: Unit | undefined;
}

function ManageSpecificIssueCard({
  specificIssue,
  unit,
}: ManageSpecificIssueCardProps) {
  const isIssueInactive = !specificIssue.active;
  const isUnitInactive = unit?.active === false;
  const isUnitUnavailable = !unit;
  const isUnavailable = !isSpecificIssueEffectivelyActive(specificIssue, unit);
  const statusLabel = isIssueInactive
    ? "Inactive"
    : isUnitInactive
      ? "Unit inactive"
      : isUnitUnavailable
        ? "Unit unavailable"
        : null;

  return (
    <Link
      to={`specific-issues/${specificIssue.id}/edit`}
      className={`group block h-full overflow-hidden rounded-xl border transition-[border-color,background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950 ${
        isUnavailable
          ? "border-zinc-200/80 bg-zinc-50/80 hover:border-zinc-300 hover:bg-zinc-100/70 dark:border-zinc-800/80 dark:bg-zinc-900/40 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/60"
          : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/70 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
      }`}
    >
      <div className={manageItemCardCointainerStyle}>
        <span
          aria-hidden="true"
          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
            isUnavailable
              ? "bg-zinc-200/70 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
          }`}
        >
          {specificIssue.name.charAt(0).toUpperCase()}
        </span>

        <div className="min-w-0">
          <p
            className={`truncate font-heading text-base font-semibold transition-colors ${
              isUnavailable
                ? "text-zinc-600 dark:text-zinc-400"
                : "text-zinc-800 dark:text-zinc-100"
            }`}
          >
            {specificIssue.name}
          </p>
          <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
            {unit?.name ?? "Unknown unit"}
          </p>
          <p className="mt-0.5 truncate text-xs text-zinc-400 dark:text-zinc-500">
            {specificIssue.slug}
          </p>
        </div>

        {statusLabel && (
          <span className={cardTagStyle}>
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
            {statusLabel}
          </span>
        )}
      </div>
    </Link>
  );
}

export default ManageSpecificIssueCard;
