export const FullPageSpinner = () => (
  <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
    <div className="h-7 w-7 animate-spin rounded-full border-2 border-zinc-200 border-t-main-500 dark:border-zinc-700 dark:border-t-main-400" />
  </div>
);

export const InlineSpinner = () => (
  <div className="flex flex-1 items-center justify-center py-16">
    <div className="h-7 w-7 animate-spin rounded-full border-2 border-zinc-200 border-t-main-500 dark:border-zinc-700 dark:border-t-main-400" />
  </div>
);
