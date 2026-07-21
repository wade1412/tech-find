import { useId } from "react";
import { headingStyleDefault } from "../styles/styles";
import ToggleSwitch from "./ToggleSwitch";

interface ActiveStatusBarProps {
  activeDescription: string;
  disabled?: boolean;
  inactiveDescription: string;
  isActive: boolean;
  label: string;
  onChange: (isActive: boolean) => void;
}

function ActiveStatusBar({
  activeDescription,
  disabled = false,
  inactiveDescription,
  isActive,
  label,
  onChange,
}: ActiveStatusBarProps) {
  const headingId = useId();

  return (
    <section
      aria-labelledby={headingId}
      className={`flex flex-col gap-3 rounded-xl border px-4 py-3 transition-colors sm:flex-row sm:items-center sm:justify-between ${
        isActive
          ? "border-zinc-200 bg-zinc-50/60 dark:border-zinc-800 dark:bg-zinc-900/40"
          : "border-red-200 bg-red-50/60 dark:border-red-900/40 dark:bg-red-950/20"
      }`}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id={headingId} className={headingStyleDefault}>
            {label}
          </h2>
          <span
            className={`rounded-lg px-2 py-0.5 text-[11px] font-semibold ${
              isActive
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-500"
                : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
            }`}
          >
            {isActive ? "Active" : "Inactive"}
          </span>
        </div>

        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {isActive ? activeDescription : inactiveDescription}
        </p>
      </div>

      <ToggleSwitch
        checked={isActive}
        disabled={disabled}
        label={label}
        onChange={onChange}
      />
    </section>
  );
}

export default ActiveStatusBar;
