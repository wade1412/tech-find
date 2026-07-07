interface EditTechnicianSectionCardProps {
  id: string;
  title: string;
  selectedSectionId: string | null;
  onClick: () => void;
}

function EditTechnicianSectionCard({
  id,
  title,
  selectedSectionId,
  onClick,
}: EditTechnicianSectionCardProps) {
  const isSelected = selectedSectionId === id;

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onClick}
      className={`
        group relative min-h-16 w-full overflow-hidden rounded-xl border px-3 py-3
        text-left transition-[background-color,border-color,color,transform] duration-200 cursor-pointer
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-500 focus-visible:ring-offset-2
        focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950
        active:scale-[0.98]
        ${
          isSelected
            ? "border-main-500/80 bg-main-500/10 text-main-600 dark:border-main-400/70 dark:bg-main-500/10 dark:text-main-400"
            : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
        }
      `}
    >
      <span className="flex items-center justify-center gap-3">
        <span className="min-w-0">
          <span className="block truncate font-heading text-sm font-semibold leading-tight">
            {title}
          </span>
        </span>
      </span>
    </button>
  );
}

export default EditTechnicianSectionCard;
