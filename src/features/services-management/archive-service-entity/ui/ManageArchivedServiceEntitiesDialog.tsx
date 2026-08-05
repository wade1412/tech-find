import { Dialog } from "@mui/material";
import { useId, type ReactNode } from "react";
import { secondaryButton } from "../../../../shared/styles/styles";

interface ArchiveDialogStatus {
  errorMessage?: string;
  isLoading: boolean;
}

interface ManageArchivedServiceEntitiesDialogProps {
  children: ReactNode;
  description: string;
  isBusy: boolean;
  isOpen: boolean;
  onClose: () => void;
  status: ArchiveDialogStatus;
  title: string;
}

function ManageArchivedServiceEntitiesDialog({
  children,
  description,
  isBusy,
  isOpen,
  onClose,
  status,
  title,
}: ManageArchivedServiceEntitiesDialogProps) {
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const descriptionId = `${dialogId}-description`;

  return (
    <Dialog
      open={isOpen}
      onClose={isBusy ? undefined : onClose}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      slotProps={{
        paper: {
          sx: {
            width: "100%",
            maxWidth: "48rem",
            maxHeight: "min(44rem, calc(100vh - 2rem))",
            margin: 2,
            borderRadius: "0.75rem",
            border: 1,
            borderColor: "divider",
          },
        },
      }}
    >
      <div className="flex min-h-0 flex-col">
        <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <h2
            id={titleId}
            className="font-heading text-base font-semibold text-zinc-900 dark:text-zinc-50"
          >
            {title}
          </h2>
          <p
            id={descriptionId}
            className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400"
          >
            {description}
          </p>
        </div>

        <div className="app-scroll min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {status.isLoading ? (
            <div className="flex flex-col gap-2" aria-label="Loading archive">
              {[0, 1, 2].map((item) => (
                <div
                  key={item}
                  className="h-20 animate-pulse rounded-xl bg-zinc-100 dark:bg-zinc-800"
                />
              ))}
            </div>
          ) : status.errorMessage ? (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400"
            >
              {status.errorMessage}
            </p>
          ) : (
            children
          )}
        </div>

        <div className="flex justify-end border-t border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <button
            type="button"
            className={secondaryButton}
            disabled={isBusy}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default ManageArchivedServiceEntitiesDialog;
