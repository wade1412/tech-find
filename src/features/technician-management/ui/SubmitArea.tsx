import { primaryButton, secondaryButton } from "../../../shared/styles/styles";

interface SubmitAreaProps {
  error: Error | null;
  isDirty: boolean;
  isPending: boolean;
  handleDiscardChanges: () => void;
  errorMessage?: string;
}

function SubmitArea({
  error,
  isDirty,
  isPending,
  handleDiscardChanges,
  errorMessage,
}: SubmitAreaProps) {
  return (
    <div className="flex flex-col gap-3 border-t border-zinc-200 pt-4 md:flex-row md:items-center md:justify-between dark:border-zinc-800">
      <div className="min-h-5">
        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50/70 px-3 py-2 text-xs font-medium text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
          >
            {errorMessage ?? "Failed to save changes. Try again."}
          </p>
        )}
      </div>

      <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end md:w-auto">
        <button
          type="button"
          disabled={!isDirty || isPending}
          onClick={handleDiscardChanges}
          className={`${secondaryButton} w-full sm:w-auto`}
        >
          Discard changes
        </button>

        <button
          type="submit"
          disabled={!isDirty || isPending}
          className={`${primaryButton} w-full sm:w-auto`}
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}

export default SubmitArea;
