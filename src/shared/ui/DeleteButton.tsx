interface DeleteButtonProps {
  label?: string;
  isDisabled?: boolean;
  onDelete: () => void;
}

function DeleteButton({ label, isDisabled, onDelete }: DeleteButtonProps) {
  return (
    <button
      type="button"
      disabled={isDisabled}
      className="-mr-1 inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-500 dark:hover:bg-red-950/30 dark:hover:text-red-400"
      aria-label={`Remove ${label}`}
      onClick={onDelete}
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
  );
}

export default DeleteButton;
