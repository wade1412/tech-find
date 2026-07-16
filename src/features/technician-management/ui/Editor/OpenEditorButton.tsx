interface OpenEditorButtonProps {
  isEditorOpen: boolean;
  isDisabled: boolean;
  toggleOpen: () => void;
  label: string;
}

function OpenEditorButton({
  isEditorOpen,
  isDisabled,
  toggleOpen,
  label,
}: OpenEditorButtonProps) {
  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={toggleOpen}
      className={[
        "inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border px-4 py-2.5 text-xs font-semibold transition-[background-color,border-color,color,opacity,transform]",
        "focus-visible:ring-main-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]",
        "disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-zinc-950",
        isEditorOpen
          ? "border-main-500/50 bg-main-500/10 text-main-500 hover:border-main-500/70 hover:bg-main-500/15 dark:border-main-400/40 dark:bg-main-400/10 dark:text-main-400 dark:hover:border-main-400/60 dark:hover:bg-main-400/15"
          : "hover:text-main-500 dark:hover:text-main-400 border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-900",
      ].join(" ")}
    >
      <svg
        className={[
          "h-3.5 w-3.5 transition-transform",
          isEditorOpen ? "rotate-45" : "",
        ].join(" ")}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 4.5v15m7.5-7.5h-15"
        />
      </svg>

      <span className="min-w-[7ch] text-center">{label}</span>
    </button>
  );
}

export default OpenEditorButton;
