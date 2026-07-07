interface ToggleStatusProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled: boolean;
}

function ToggleStatus({ checked, onChange, disabled }: ToggleStatusProps) {
  return (
    <button
      type="button"
      role="switch"
      disabled={disabled}
      aria-label="Technician status"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="group flex cursor-pointer items-center gap-2.5 select-none focus:outline-none disabled:pointer-events-none"
    >
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full border transition-[border,background-color,opacity] duration-200 group-focus-visible:ring-2 group-focus-visible:ring-main-500 group-focus-visible:ring-offset-1 ${
          checked
            ? `border-main-500 bg-main-500 ${disabled ? "opacity-50" : "opacity-100"}`
            : `border-zinc-300 bg-zinc-200 dark:border-zinc-600 dark:bg-zinc-700 ${disabled ? "opacity-50" : "opacity-100"}`
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-4.5 w-4.5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>

      <span
        className={`text-sm font-medium min-w-15 transition-colors ${
          checked
            ? `text-main-500 ${disabled ? "opacity-50" : "opacity-100"}`
            : `text-zinc-600 dark:text-zinc-400 ${disabled ? "opacity-50" : "opacity-100"}`
        }`}
      >
        {checked ? "Active" : "Inactive"}
      </span>
    </button>
  );
}

export default ToggleStatus;
