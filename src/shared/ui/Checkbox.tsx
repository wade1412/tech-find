interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}

function Checkbox({ id, label, checked, onChange }: CheckboxProps) {
  return (
    <label className="group flex cursor-pointer items-center gap-2 select-none">
      {/* Hidden input */}
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />

      {/* Custom square - chaning color on peer-checked */}
      <span
        className={`peer-focus-visible:ring-main-500 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-offset-1 ${checked ? "border-main-500 bg-main-500" : "border-zinc-300 bg-white group-hover:border-zinc-400 dark:border-zinc-600 dark:bg-zinc-800 dark:group-hover:border-zinc-500"}`}
      >
        <svg
          className={`h-2.5 w-2.5 text-zinc-900 transition-opacity ${checked ? "opacity-100" : "opacity-0"}`}
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
        className={`font-heading text-sm font-medium transition-colors ${checked ? "text-main-500" : "text-zinc-600 dark:text-zinc-400"}`}
      >
        {label}
      </span>
    </label>
  );
}

export default Checkbox;
