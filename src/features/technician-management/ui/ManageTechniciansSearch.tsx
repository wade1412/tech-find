interface ManageTechniciansSearchProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

function ManageTechniciansSearch({
  value,
  onValueChange,
  className = "",
}: ManageTechniciansSearchProps) {
  return (
    <div className={`relative ${className}`}>
      <svg
        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="11" cy="11" r="7" />
        <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
      </svg>

      <input
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        type="text"
        placeholder="Search for a technician..."
        aria-label="Search technicians"
        className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 py-2 pr-3.5 pl-9 text-sm text-zinc-900 outline-none transition-all focus:border-main-500 focus:bg-white focus:ring-2 focus:ring-main-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-main-500 dark:focus:bg-zinc-950"
      />

      {value && (
        <button
          type="button"
          onClick={() => onValueChange("")}
          aria-label="Clear search"
          className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-0.5 text-zinc-400 transition-colors hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300"
        >
          <svg
            className="h-3.5 w-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

export default ManageTechniciansSearch;
