const headingStyleBase =
  "font-heading text-xs font-semibold uppercase tracking-widest";

export const headingStyleDefault = `${headingStyleBase}  text-zinc-400 dark:text-zinc-500`;

export const headingStyleWithBottomMargin = `${headingStyleDefault} mb-3`;

export const ignoreItemHeadingStyle = `${headingStyleBase} text-main-500/80 dark:text-main-400/85`;

export const formStyle = "flex flex-col gap-4";

export const formWithPaddingStyle = `${formStyle} p-2`;

export const formLabelStyle =
  "text-sm font-medium text-zinc-400 dark:text-zinc-500";

export const formInputStyle =
  "rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-sm text-zinc-900 outline-none transition-[border,background-color,color] focus:border-main-500 focus:bg-white focus:ring-2 focus:ring-main-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-main-500 dark:focus:bg-zinc-950 disabled:cursor-not-allowed disabled:opacity-60";

export const skillGroupTitleStyle =
  "font-heading border-b border-zinc-100 px-5 py-3 text-sm font-bold text-zinc-800 dark:text-zinc-950 dark:border-zinc-800 bg-main-500/80 dark:bg-main-400/85 rounded-t-xl";

export const managementActionButtonBaseStyle =
  "inline-flex w-full min-w-44 cursor-pointer items-center justify-center gap-1.5 rounded-xl border bg-white px-4 py-2.5 text-xs font-semibold text-zinc-600 transition-[background-color,border-color,color,opacity,transform] focus:outline-none focus-visible:ring-2 focus-visible:ring-main-500 focus-visible:ring-offset-2 active:scale-[0.98]  dark:focus-visible:ring-offset-zinc-950 sm:w-46";

export const archivedManagementItemsButtonStyle = `${managementActionButtonBaseStyle} border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 dark:hover:text-zinc-100`;
export const createManagementItemButtonStyle = `${managementActionButtonBaseStyle} border-zinc-200 hover:bg-zinc-50 hover:border-main-500 hover:text-main-500 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:border-main-400 dark:hover:bg-zinc-900 dark:hover:text-main-400`;

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
  "inline-flex cursor-pointer items-center justify-center rounded-xl bg-red-600/80 px-4 py-2.5 text-xs font-semibold text-white transition-[background-color,opacity,transform] enabled:hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 dark:bg-red-600/80 dark:enabled:hover:bg-red-500 dark:focus-visible:ring-offset-zinc-900";

const autocompleteMutedBase =
  "rounded-xl border border-dashed border-zinc-200 px-3 text-zinc-400 dark:border-zinc-800 dark:text-zinc-500 bg-zinc-50/70 dark:bg-zinc-950/30";

export const autocompleteMutedStyle = `${autocompleteMutedBase} text-xs py-[1.2rem]`; // text xs + 1.2rem py matches the 56 pixels height of the active autocomplete

export const noEditValuesStyle = `${autocompleteMutedBase} py-[1.075rem] text-center text-sm`; // text sm + 1.075rem py matches the 56 pixels as well

export const sectionHeaderSubtextStyle =
  "text-xs text-zinc-500 dark:text-zinc-400";

export const manageListGridStyle = "grid grid-cols-1 gap-2.5 md:grid-cols-3";

export const manageItemCardCointainerStyle =
  "grid min-h-20 grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-3";

export const centeredContainerStyle =
  "mx-auto w-full max-w-6xl px-4 py-4 md:px-6";

export const buttonContainerStyle =
  "flex w-full flex-col gap-2 sm:flex-row md:w-auto md:items-center";

export const pageTitleWithButtonsContainerStyle =
  "flex flex-col gap-3 md:flex-row md:items-center md:justify-between";

export const editHeaderWithButtonContainerStyle =
  "flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center";

export const archiveEntityButtonStyle =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-zinc-200 bg-transparent px-4 py-2.5 text-xs font-semibold text-zinc-600 transition-[background-color,border-color,color,opacity,transform] hover:border-red-500/50 hover:text-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-main-500 focus-visible:ring-offset-2 active:scale-[0.98] dark:border-zinc-700 dark:text-zinc-300  dark:focus-visible:ring-offset-zinc-950";

export const editSectionListStyle = "grid grid-cols-2 md:grid-cols-4 gap-2.5";

export const searchRowStyle =
  "flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between";

export const cardTagStyle =
  "inline-flex items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-white/70 px-2.5 py-1 text-xs font-medium text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/60 dark:text-zinc-400";

export const brandsListStyle = "flex flex-col gap-2.5";

export const inputHintStyle =
  "mt-1 px-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400";

export const inputErrorStyle =
  "mt-1 px-2 text-xs font-medium text-red-600 dark:text-red-400";
