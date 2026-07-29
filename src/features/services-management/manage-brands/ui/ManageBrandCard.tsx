import { Link } from "react-router";
import type { Brand } from "../../../../entities/brand/brand.types";
import type { BrandGroup } from "../../../../entities/brandGroup/brandGroup.types";
import { cardTagStyle } from "../../../../shared/styles/styles";

interface ManageBrandCardProps {
  brand: Brand;
  brandGroup: BrandGroup | undefined;
}

function ManageBrandCard({ brand, brandGroup }: ManageBrandCardProps) {
  const isInactive = !brand.active;
  const isGroupInactive = brandGroup?.active === false;
  const isUnavailable = isInactive || isGroupInactive;
  const statusLabel = isInactive
    ? "Inactive"
    : isGroupInactive
      ? "Group inactive"
      : null;

  return (
    <Link
      to={`brands/${brand.id}/edit`}
      className={`group block h-full overflow-hidden rounded-xl border transition-[border-color,background-color] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950 ${
        isUnavailable
          ? "border-zinc-200/80 bg-zinc-50/80 hover:border-zinc-300 hover:bg-zinc-100/70 dark:border-zinc-800/80 dark:bg-zinc-900/40 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/60"
          : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/70 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
      }`}
    >
      <div className="grid min-h-20 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3">
        <span
          aria-hidden="true"
          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
            isUnavailable
              ? "bg-zinc-200/70 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
          }`}
        >
          {brand.name.charAt(0).toUpperCase()}
        </span>

        <div className="min-w-0">
          <p
            className={`truncate font-heading text-base font-semibold transition-colors ${
              isUnavailable
                ? "text-zinc-600 dark:text-zinc-400"
                : "text-zinc-800 dark:text-zinc-100"
            }`}
          >
            {brand.name}
          </p>

          <p className="mt-1 truncate text-xs text-zinc-500 dark:text-zinc-400">
            {brandGroup?.name ?? "Unknown group"}
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

export default ManageBrandCard;
