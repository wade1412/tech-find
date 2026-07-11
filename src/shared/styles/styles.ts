export const headingStyleWithBottomMargin =
  "font-heading mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500";

export const headingStyleDefault =
  "font-heading text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500";

export const formStyle = "flex flex-col gap-6";

export const skillGroupTitleStyle =
  "font-heading border-b border-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-800 dark:border-zinc-800 dark:text-zinc-100";

export const primaryButton =
  "bg-main-500 enabled:hover:bg-main-400 focus-visible:ring-main-500 inline-flex cursor-pointer items-center justify-center rounded-xl px-4 py-2.5 text-xs font-semibold text-zinc-950 transition-[background-color,opacity] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-zinc-950";

export const secondaryButton =
  "focus-visible:ring-main-500 inline-flex cursor-pointer items-center justify-center rounded-xl px-4 py-2.5 text-xs font-semibold text-zinc-500 transition-[background-color,color,opacity] enabled:hover:bg-zinc-100 enabled:hover:text-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400 dark:enabled:hover:bg-zinc-800/70 dark:enabled:hover:text-zinc-100 dark:focus-visible:ring-offset-zinc-950";

const ghostBase =
  "inline-flex cursor-pointer items-center justify-center rounded-xl px-4 py-2 text-xs font-semibold text-zinc-500 transition-[color,opacity] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400";

export const ghostButton = `${ghostBase} focus-visible:ring-main-500 enabled:hover:text-zinc-800 dark:enabled:hover:text-zinc-100 dark:focus-visible:ring-offset-zinc-950`;

export const destructiveGhostButton = `${ghostBase} focus-visible:ring-red-500 enabled:hover:text-red-600 enabled:dark:hover:text-red-400`;

const autocompleteMutedBase =
  "rounded-xl border border-dashed border-zinc-200 px-3 text-zinc-400 dark:border-zinc-800 dark:text-zinc-500 bg-zinc-50/70 dark:bg-zinc-950/30";

export const autocompleteMutedStyle = `${autocompleteMutedBase} text-xs py-[1.2rem]`; // text xs + 1.2rem py matches the 56 pixels height of the active autocomplete

export const noEditValuesStyle = `${autocompleteMutedBase} py-[1.075rem] text-center text-sm`; // text sm + 1.075rem py matches the 56 pixels as well
