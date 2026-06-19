interface EditTechnicianSectionCardProps {
  id: string;
  title: string;
  selectedSectionId: string | null;
  onToggle: () => void;
}

function EditTechnicianSectionCard({
  id,
  title,
  selectedSectionId,
  onToggle,
}: EditTechnicianSectionCardProps) {
  const isSelected = selectedSectionId === id;

  return (
    <button
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={onToggle}
      className={`relative flex cursor-pointer items-center justify-center overflow-hidden rounded-xl py-6 px-2 text-center transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main-500
        ${
          isSelected
            ? "border-2 border-main-500 bg-main-500/10 text-main-500 shadow-inner dark:bg-main-500/10"
            : "border border-zinc-200 bg-white text-zinc-700 shadow-sm hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md dark:border-zinc-700/60 dark:bg-zinc-800/50 dark:text-zinc-200 dark:hover:border-zinc-600"
        }
        `}
    >
      <span className="font-heading text-sm font-semibold leading-tight truncate">
        {title}
      </span>
    </button>
  );
}

export default EditTechnicianSectionCard;
