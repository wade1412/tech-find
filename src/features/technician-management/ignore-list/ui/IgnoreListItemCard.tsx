import DeleteButton from "../../../../shared/ui/DeleteButton";

interface IgnoreListCardProps {
  unitName: string | null;
  brandName: string | null;
  issueName: string | null;
  onRemove: () => void;
}

interface IgnoreChip {
  label?: string;
  value: string;
}

function IgnoreListItemCard({
  unitName,
  brandName,
  issueName,
  onRemove,
}: IgnoreListCardProps) {
  const ignoreChips: IgnoreChip[] = [
    unitName
      ? { label: "Unit", value: unitName }
      : issueName
        ? null
        : { value: "All units" },
    brandName
      ? { label: "Brand", value: brandName }
      : issueName
        ? null
        : { value: "All brands" },
    issueName ? { label: "Issue", value: issueName } : null,
  ].filter((chip): chip is IgnoreChip => Boolean(chip));

  return (
    <div className="group flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
      <div className="flex gap-2">
        {ignoreChips.map((chip) => (
          <span
            key={`${chip.label ?? "all"}-${chip.value}`}
            className="rounded-lg border px-4 py-2 text-sm"
          >
            {chip.label ? `${chip.label}: ${chip.value}` : chip.value}
          </span>
        ))}
      </div>

      <button
        type="button"
        className="focus-visible:ring-main-500 inline-flex h-8 cursor-pointer items-center justify-center rounded-lg px-3 text-xs font-semibold text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-zinc-700/60 dark:hover:text-zinc-100"
      >
        Edit
      </button>

      <DeleteButton
        label={ignoreChips.map((c) => c.value).join(", ")}
        onDelete={onRemove}
      />
    </div>
  );
}

export default IgnoreListItemCard;
