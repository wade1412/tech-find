interface SubmitAreaProps {
  error: Error | null;
  isDirty: boolean;
  isPending: boolean;
  handleDiscardChanges: () => void;
}

function SubmitArea({
  error,
  isDirty,
  isPending,
  handleDiscardChanges,
}: SubmitAreaProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-zinc-200 pt-4 md:flex-row md:items-center md:justify-between dark:border-zinc-800">
      <div className="min-h-5">
        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50/70 px-3 py-2 text-xs font-medium text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
          >
            Failed to save changes. Try again.
          </p>
        )}
      </div>

      <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end md:w-auto">
        <button
          type="button"
          disabled={!isDirty || isPending}
          onClick={handleDiscardChanges}
          className="transition-[color,opacity, transform] enabled:hover:text-main-500 focus-visible:ring-main-500 cursor-pointer rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-500 duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 dark:text-zinc-400"
        >
          Discard changes
        </button>

        <button
          type="submit"
          disabled={!isDirty || isPending}
          className="bg-main-500 hover:bg-main-400 focus-visible:ring-main-500 inline-flex w-full cursor-pointer items-center justify-center rounded-xl px-4 py-2.5 text-xs font-semibold text-zinc-950 transition-[background-color,transform,opacity] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 sm:w-auto dark:focus-visible:ring-offset-zinc-950"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

export default SubmitArea;
