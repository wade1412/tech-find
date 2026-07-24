import { Dialog } from "@mui/material";
import {
  primaryButton,
  secondaryButton,
} from "../../../../shared/styles/styles";
import type { User } from "../../../../entities/user/user.types";

interface ConfirmArchiveUserDialogProps {
  user: User;
  isOpen: boolean;
  isPending: boolean;
  error: Error | null;
  onClose: () => void;
  onConfirm: () => void;
}

function ConfirmArchiveUserDialog({
  user,
  isOpen,
  isPending,
  error,
  onClose,
  onConfirm,
}: ConfirmArchiveUserDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={isPending ? undefined : onClose}
      aria-labelledby="archive-user-title"
      aria-describedby="archive-user-description"
      slotProps={{
        paper: {
          sx: {
            width: "100%",
            maxWidth: "30rem",
            margin: 2,
            borderRadius: "0.75rem",
            border: 1,
            borderColor: "divider",
          },
        },
      }}
    >
      <div className="flex flex-col">
        <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <h2
            id="archive-user-title"
            className="font-heading text-base font-semibold text-zinc-900 dark:text-zinc-50"
          >
            Archive user?
          </h2>
          <p
            id="archive-user-description"
            className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400"
          >
            {user.alias} will be removed from user lists and job matching.
          </p>
        </div>

        <div className="flex flex-col gap-3 px-5 py-5 text-sm text-zinc-600 dark:text-zinc-300">
          <p>
            User information and access role will be preserved. You can restore
            this user from the archive at any time.
          </p>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50/70 px-3 py-2 text-xs font-medium text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
            >
              Failed to archive user. Please try again.
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-zinc-200 px-5 py-4 sm:flex-row sm:justify-end dark:border-zinc-800">
          <button
            type="button"
            className={secondaryButton}
            disabled={isPending}
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className={primaryButton}
            disabled={isPending}
            onClick={onConfirm}
          >
            {isPending ? "Archiving..." : "Archive user"}
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default ConfirmArchiveUserDialog;
