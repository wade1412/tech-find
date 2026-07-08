import DeleteButton from "../../../../shared/ui/DeleteButton";

interface IgnoreListCardProps {
  unitName: string | null;
  brandName: string | null;
  issueName: string | null;
  onRemove: () => void;
}

function IgnoreListItemCard({
  unitName,
  brandName,
  issueName,
  onRemove,
}: IgnoreListCardProps) {
  const ignoreItemInfo = [
    unitName || "",
    brandName ? `${brandName} Brand` : "",
    issueName || "",
  ].join(" ");

  return (
    <div className="group flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
      <div>
        <span className="min-w-0 flex-1 truncate px-1 font-normal text-sm text-zinc-800 dark:text-zinc-100">
          {ignoreItemInfo}
        </span>
      </div>

      <button
        type="button"
        className="focus-visible:ring-main-500 inline-flex h-8 cursor-pointer items-center justify-center rounded-lg px-3 text-xs font-semibold text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-zinc-700/60 dark:hover:text-zinc-100"
      >
        Edit
      </button>

      <DeleteButton label={ignoreItemInfo} onDelete={onRemove} />
    </div>
  );
}

export default IgnoreListItemCard;
