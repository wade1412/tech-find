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
        group relative min-h-20 w-full overflow-hidden rounded-2xl border px-3 py-4
        text-left transition-all duration-200 cursor-pointer
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-500 focus-visible:ring-offset-2
        focus-visible:ring-offset-zinc-50 dark:focus-visible:ring-offset-zinc-950
        active:scale-[0.98]
        ${
          isSelected
            ? "border-main-500 bg-main-500/10 text-main-600 shadow-sm ring-1 ring-main-500/40 dark:bg-main-500/10 dark:text-main-400"
            : "border-zinc-200 bg-white text-zinc-700 shadow-sm hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
        }
      `}
    >
      <span
        className={`
          absolute inset-x-0 bottom-0 h-0.5 transition-opacity duration-200
          ${isSelected ? "bg-main-500 opacity-100" : "bg-transparent opacity-0"}
        `}
      />

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
