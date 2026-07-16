type SegmentedControlOption<T extends string> = {
  label: string;
  value: T;
};

type SegmentedControlProps<T extends string> = {
  ariaLabel: string;
  options: readonly SegmentedControlOption<T>[];
  disabled?: boolean;
  onChange: (value: T) => void;
  value: T | null;
};

function SegmentedControl<T extends string>({
  ariaLabel,
  options,
  disabled = false,
  onChange,
  value,
}: SegmentedControlProps<T>) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="flex overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60"
    >
      {options.map((option, index) => {
        const isSelected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={[
              "flex-1 cursor-pointer px-2 py-2.5 text-xs font-semibold transition-colors focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-main-500 focus-visible:ring-inset focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              index > 0 && "border-l border-zinc-200 dark:border-zinc-800",
              isSelected
                ? "bg-main-500 text-zinc-950 dark:bg-main-400"
                : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800/70 dark:hover:text-zinc-100",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default SegmentedControl;
