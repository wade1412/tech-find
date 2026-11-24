interface CheckboxProps {
  id: string;
  disabled?: boolean;
  label: string;
  checked: boolean;
  onChange: () => void;
}

function Checkbox({
  id,
  disabled = false,
  label,
  checked,
  onChange,
}: CheckboxProps) {
  return (
    <label className="group flex cursor-pointer items-center gap-2 select-none has-disabled:cursor-not-allowed">
      {/* Hidden input */}
      <input
        type="checkbox"
        id={id}
        disabled={disabled}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />

      {/* Custom square - changing color on peer-checked */}
      <span
        className={`peer-focus-visible:ring-main-500 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-[color,background-color,border-color,opacity] duration-250 peer-focus-visible:ring-2 peer-focus-visible:ring-offset-1 peer-disabled:opacity-40 ${
          checked
            ? "border-main-500 bg-main-500"
            : "border-zinc-300 bg-white peer-enabled:group-hover:border-zinc-400 dark:border-zinc-600 dark:bg-zinc-800 dark:peer-enabled:group-hover:border-zinc-500"
        }`}
      >
        <svg
          className={`h-2.5 w-2.5 text-zinc-900 transition-opacity duration-250 ${checked ? "opacity-100" : "opacity-0"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </span>

      {/* Label for the element */}
      <span
        className={`font-heading text-sm font-medium transition-[color,opacity] duration-250 peer-disabled:opacity-40 ${
          checked ? "text-main-500" : "text-zinc-600 dark:text-zinc-400"
        }`}
      >
        {label}
      </span>
    </label>
  );
}

export default Checkbox;
