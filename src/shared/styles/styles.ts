export const headingStyleWithBottomMargin =
  "font-heading mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500";

export const headingStyleDefault =
  "font-heading text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500";

export const formStyle = "flex flex-col gap-4";

export const formWithPaddingStyle = `${formStyle} p-2`;

export const skillGroupTitleStyle =
  "font-heading border-b border-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-800 dark:border-zinc-800 dark:text-zinc-100";

export const manageTechnicianActionButtonBaseStyle =
  "inline-flex w-full min-w-44 cursor-pointer items-center justify-center gap-1.5 rounded-xl border bg-white px-4 py-2.5 text-xs font-semibold text-zinc-600 transition-[background-color,border-color,color,opacity,transform] focus:outline-none focus-visible:ring-2 focus-visible:ring-main-500 focus-visible:ring-offset-2 active:scale-[0.98]  dark:focus-visible:ring-offset-zinc-950 sm:w-46";

export const archivedTechniciansButtonStyle = `${manageTechnicianActionButtonBaseStyle} border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-100`;
export const createNewTechnicianButtonStyle = `${manageTechnicianActionButtonBaseStyle} border-zinc-200 hover:bg-zinc-50 hover:border-main-500 hover:text-main-500 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:border-main-400 dark:hover:bg-zinc-900 dark:hover:text-main-400`;

export const primaryButton =
  "bg-main-500 enabled:hover:bg-main-400 focus-visible:ring-main-500 inline-flex cursor-pointer items-center justify-center rounded-xl px-4 py-2.5 text-xs font-semibold text-zinc-950 transition-[background-color,opacity] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-offset-zinc-950";

export const secondaryButton =
  "focus-visible:ring-main-500 inline-flex cursor-pointer items-center justify-center rounded-xl px-4 py-2.5 text-xs font-semibold text-zinc-500 transition-[background-color,color,opacity] enabled:hover:bg-zinc-100 enabled:hover:text-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400 dark:enabled:hover:bg-zinc-800/70 dark:enabled:hover:text-zinc-100 dark:focus-visible:ring-offset-zinc-950";

const ghostBase =
  "inline-flex cursor-pointer items-center justify-center rounded-xl px-4 py-2 text-xs font-semibold text-zinc-500 transition-[color,opacity] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-400";

export const ghostButton = `${ghostBase} focus-visible:ring-main-500 enabled:hover:text-zinc-800 dark:enabled:hover:text-zinc-100 dark:focus-visible:ring-offset-zinc-950`;

export const destructiveGhostButton = `${ghostBase} focus-visible:ring-red-500 enabled:hover:text-red-600 enabled:dark:hover:text-red-400`;

export const destructiveOutlineButton =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-red-300 bg-transparent px-4 py-3 text-xs text-red-600 transition-[background-color,border-color,color,opacity,transform] enabled:hover:border-red-300 enabled:hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/60 dark:text-red-400 dark:enabled:hover:border-red-800 dark:enabled:hover:bg-red-950/30 dark:focus-visible:ring-offset-zinc-950";

export const destructiveButton =
  "inline-flex cursor-pointer items-center justify-center rounded-xl bg-red-600/90 px-4 py-2.5 text-xs font-semibold text-white transition-[background-color,opacity,transform] enabled:hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-600/90 dark:enabled:hover:bg-red-500 dark:focus-visible:ring-offset-zinc-900";

const autocompleteMutedBase =
  "rounded-xl border border-dashed border-zinc-200 px-3 text-zinc-400 dark:border-zinc-800 dark:text-zinc-500 bg-zinc-50/70 dark:bg-zinc-950/30";

export const autocompleteMutedStyle = `${autocompleteMutedBase} text-xs py-[1.2rem]`; // text xs + 1.2rem py matches the 56 pixels height of the active autocomplete

export const noEditValuesStyle = `${autocompleteMutedBase} py-[1.075rem] text-center text-sm`; // text sm + 1.075rem py matches the 56 pixels as well

export const sectionHeaderSubtextStyle =
  "text-xs text-zinc-500 dark:text-zinc-400";
