import { useState } from "react";
import { Dialog, TextField } from "@mui/material";
import type { Technician } from "../../../../entities/technician/technician.types";
import {
  destructiveButton,
  secondaryButton,
} from "../../../../shared/styles/styles";

interface ConfirmPermanentTechnicianPurgeDialogProps {
  technician: Technician | null;
  isPending: boolean;
  error: Error | null;
  onClose: () => void;
  onConfirm: () => void;
}

function ConfirmPermanentTechnicianPurgeDialog({
  technician,
  isPending,
  error,
  onClose,
  onConfirm,
}: ConfirmPermanentTechnicianPurgeDialogProps) {
  const [confirmationValue, setConfirmationValue] = useState("");

  const canConfirm = confirmationValue.trim() === technician?.alias;

  const handleClose = () => {
    if (isPending) return;
    setConfirmationValue("");
    onClose();
  };

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canConfirm || isPending) return;
    onConfirm();
  };

  return (
    <Dialog
      open={Boolean(technician)}
      onClose={handleClose}
      aria-labelledby="purge-technician-title"
      aria-describedby="purge-technician-description"
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
      <form className="flex flex-col" onSubmit={handleSubmit} noValidate>
        <div className="border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <h2
            id="purge-technician-title"
            className="font-heading text-base font-semibold text-zinc-900 dark:text-zinc-50"
          >
            Permanently purge technician?
          </h2>
          <p
            id="purge-technician-description"
            className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400"
          >
            This owner-only action cannot be undone.
          </p>
        </div>

        <div className="flex flex-col gap-4 px-5 py-5">
          <div className="rounded-xl border border-red-200 bg-red-50/70 px-3.5 py-3 text-xs leading-5 text-red-700 dark:border-red-900/50 dark:bg-red-950/25 dark:text-red-300">
            Purging <strong>{technician?.alias}</strong> permanently removes the
            profile, service zones, skills, and ignore-list items.
          </div>

          <div>
            <label
              htmlFor="purge-technician-confirmation"
              className="mb-2 block text-xs font-medium text-zinc-600 dark:text-zinc-300"
            >
              Type <strong>{technician?.alias}</strong> to confirm
            </label>
            <TextField
              id="purge-technician-confirmation"
              value={confirmationValue}
              onChange={(event) => setConfirmationValue(event.target.value)}
              disabled={isPending}
              autoFocus
              autoComplete="off"
              fullWidth
              size="small"
              placeholder={technician?.alias}
              slotProps={{
                htmlInput: {
                  "aria-label": "Technician alias confirmation",
                },
              }}
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50/70 px-3 py-2 text-xs font-medium text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
            >
              Failed to purge technician. Please try again.
            </p>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-zinc-200 px-5 py-4 sm:flex-row sm:justify-end dark:border-zinc-800">
          <button
            type="button"
            className={secondaryButton}
            disabled={isPending}
            onClick={handleClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={destructiveButton}
            disabled={!canConfirm || isPending}
          >
            {isPending ? "Purging..." : "Purge permanently"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}

export default ConfirmPermanentTechnicianPurgeDialog;
