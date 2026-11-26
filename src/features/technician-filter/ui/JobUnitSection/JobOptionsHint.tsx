interface JobOptionsHint {
  hintMessage: string;
}

function JobOptionsHint({ hintMessage }: JobOptionsHint) {
  return (
    <aside
      role="note"
      className="flex items-center gap-2.5 w-full px-3.5 py-3 border border-dashed border-zinc-400 bg-zinc-50/50 rounded-xl dark:border-zinc-800 dark:bg-zinc-900/50 "
    >
      <svg
        aria-hidden
        className="mt-0.5 h-4 w-4 shrink-0 text-main-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>

      <p className="text-xs leading-4 text-zinc-600 dark:text-zinc-400 ">
        {hintMessage}
      </p>
    </aside>
  );
}

export default JobOptionsHint;
