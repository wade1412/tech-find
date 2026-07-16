import { ignoreItemHeadingStyle } from "../../../../shared/styles/styles";
import DeleteButton from "../../../../shared/ui/DeleteButton";

interface IgnoreListCardProps {
  isDisabled: boolean;
  unitName: string | null;
  brandName: string | null;
  issueName: string | null;
  onEdit: () => void;
  onRemove: () => void;
}

interface IgnoreChip {
  label: string;
  value: string;
}

function IgnoreListItemCard({
  isDisabled,
  unitName,
  brandName,
  issueName,
  onEdit,
  onRemove,
}: IgnoreListCardProps) {
  const ignoreChips = (
    [
      unitName
        ? { label: "Unit", value: unitName }
        : issueName
          ? null
          : { label: "Unit", value: "All units" },
      brandName
        ? { label: "Brand", value: brandName }
        : { label: "Brand", value: "All brands" },
      issueName ? { label: "Issue", value: issueName } : null,
    ] satisfies Array<IgnoreChip | null>
  ).filter((chip): chip is IgnoreChip => chip !== null);

  return (
    <div className="group flex h-full min-w-0 flex-col gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm transition-[background-color,border-color] hover:border-zinc-300 hover:bg-zinc-50/70 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1 space-y-2 pr-1">
        <p className={ignoreItemHeadingStyle}>Ignore when</p>

        <div className="flex flex-wrap gap-1.5">
          {ignoreChips.map((chip) => (
            <span
              key={`${chip.label}-${chip.value}`}
              className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1.5 text-xs text-zinc-700 dark:border-zinc-700/70 dark:bg-zinc-800/60 dark:text-zinc-200"
            >
              <span className="font-medium text-zinc-400 dark:text-zinc-500">
                {chip.label}
              </span>
              <span className="min-w-0 truncate font-medium">{chip.value}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-end gap-1 sm:self-center">
        <button
          type="button"
          disabled={isDisabled}
          onClick={onEdit}
          className="focus-visible:ring-main-500 inline-flex h-8 cursor-pointer items-center justify-center rounded-lg px-3 text-xs font-semibold text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-zinc-700/60 dark:hover:text-zinc-100"
        >
          Edit
        </button>

        <DeleteButton
          label={ignoreChips.map((c) => c.value).join(", ")}
          onDelete={onRemove}
          isDisabled={isDisabled}
        />
      </div>
    </div>
  );
}

export default IgnoreListItemCard;
