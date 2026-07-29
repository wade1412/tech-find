import { Link } from "react-router";
import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";
import { cardTagStyle } from "../../../../shared/styles/styles";

interface ManageBrandGroupCardProps {
  brandGroup: BrandGroup;
  brandCount: number;
}

function ManageBrandGroupCard({
  brandGroup,
  brandCount,
}: ManageBrandGroupCardProps) {
  const isInactive = !brandGroup.active;

  return (
    <Link
      to={`brand-groups/${brandGroup.id}/edit`}
      className={`group block h-full overflow-hidden rounded-xl border transition-[border-color,background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950 ${
        isInactive
          ? "border-zinc-200/80 bg-zinc-50/80 hover:border-zinc-300 hover:bg-zinc-100/70 dark:border-zinc-800/80 dark:bg-zinc-900/40 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/60"
          : "border-main-500/30 bg-white hover:border-main-500/50 hover:bg-zinc-50 dark:border-main-400/25 dark:bg-zinc-900/70 dark:hover:border-main-400/40 dark:hover:bg-zinc-900"
      }`}
    >
      <div className="grid min-h-20 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
        <span
          aria-hidden="true"
          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold transition-colors ${
            isInactive
              ? "bg-zinc-200/70 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
              : "bg-main-500/10 text-main-600 dark:bg-main-400/10 dark:text-main-400"
          }`}
        >
          {brandGroup.name.charAt(0).toUpperCase()}
        </span>

        <div className="min-w-0">
          <p className="truncate text-[0.6875rem] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Brand group
          </p>

          <p
            className={`mt-0.5 truncate font-heading text-base font-semibold transition-colors ${
              isInactive
                ? "text-zinc-600 dark:text-zinc-400"
                : "text-zinc-800 dark:text-zinc-100"
            }`}
          >
            {brandGroup.name}
          </p>

          <p className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400">
            {brandCount} {brandCount === 1 ? "brand" : "brands"} · Order{" "}
            {brandGroup.display_order}
          </p>
        </div>

        {isInactive && (
          <span className={cardTagStyle}>
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500" />
            Inactive
          </span>
        )}
      </div>
    </Link>
  );
}

export default ManageBrandGroupCard;
