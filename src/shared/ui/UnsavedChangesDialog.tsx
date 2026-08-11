import { Dialog } from "@mui/material";
import { destructiveButton, secondaryButton } from "../styles/styles";

interface UnsavedChangesDialogProps {
  isOpen: boolean;
  onStay: () => void;
  onLeave: () => void;
}

function UnsavedChangesDialog({
  isOpen,
  onLeave,
  onStay,
}: UnsavedChangesDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onStay}
      aria-labelledby="unsaved-changes-title"
      aria-describedby="unsaved-changes-description"
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
            id="unsaved-changes-title"
            className="font-heading text-base font-semibold text-zinc-900 dark:text-zinc-50"
          >
            Leave without saving?
          </h2>
          <p
            id="unsaved-changes-description"
            className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400"
          >
            You have unsaved changes on this page.
          </p>
        </div>

        <div className="px-5 py-5 text-sm leading-6 text-zinc-600 dark:text-zinc-300">
          Leaving now will discard the changes you have made since the last
          save.
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-zinc-200 px-5 py-4 sm:flex-row sm:justify-end dark:border-zinc-800">
          <button type="button" className={secondaryButton} onClick={onStay}>
            Stay on page
          </button>
          <button type="button" className={destructiveButton} onClick={onLeave}>
            Leave without saving
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default UnsavedChangesDialog;
