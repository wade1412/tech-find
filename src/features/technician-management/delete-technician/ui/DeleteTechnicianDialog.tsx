import { useState } from "react";
import { Dialog, TextField } from "@mui/material";
import { destructiveButton, secondaryButton } from "../../../../shared/styles/styles";

interface DeleteTechnicianDialogProps {
  isOpen: boolean;
  technicianAlias: string;
  isPending: boolean;
  error: Error | null;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteTechnicianDialog({
  isOpen,
  technicianAlias,
  isPending,
  error,
  onClose,
  onConfirm,
}: DeleteTechnicianDialogProps) {
  const [confirmationValue, setConfirmationValue] = useState("");

  const canConfirm = confirmationValue.trim() === technicianAlias;

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
      open={isOpen}
      onClose={() => handleClose()}
      aria-labelledby="delete-technician-title"
      aria-describedby="delete-technician-description"
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
            id="delete-technician-title"
            className="font-heading text-base font-semibold text-zinc-900 dark:text-zinc-50"
          >
            Permanently delete technician?
          </h2>
          <p
            id="delete-technician-description"
            className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400"
          >
            This action cannot be undone.
          </p>
        </div>

        <div className="flex flex-col gap-4 px-5 py-5">
          <div className="rounded-xl border border-red-200 bg-red-50/70 px-3.5 py-3 text-xs leading-5 text-red-700 dark:border-red-900/50 dark:bg-red-950/25 dark:text-red-300">
            Deleting <strong>{technicianAlias}</strong> also permanently removes
            all assigned service zones, skills, and ignore-list items.
          </div>

          <div>
            <label
              htmlFor="delete-technician-confirmation"
              className="mb-2 block text-xs font-medium text-zinc-600 dark:text-zinc-300"
            >
              Type <strong>{technicianAlias}</strong> to confirm
            </label>
            <TextField
              id="delete-technician-confirmation"
              value={confirmationValue}
              onChange={(event) => setConfirmationValue(event.target.value)}
              disabled={isPending}
              autoFocus
              autoComplete="off"
              fullWidth
              size="small"
              placeholder={technicianAlias}
              slotProps={{
                htmlInput: {
                  "aria-label": "Technician alias confirmation",
                },
              }}
              sx={(theme) => ({
                "& .MuiOutlinedInput-root": {
                  borderRadius: "0.75rem",
                  fontSize: "0.875rem",
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? "rgba(24, 24, 27, 0.5)"
                      : "#ffffff",
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.error.main,
                    borderWidth: 1,
                  },
                },
              })}
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50/70 px-3 py-2 text-xs font-medium text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
            >
              Failed to delete technician. Please try again.
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
            {isPending ? "Deleting..." : "Delete permanently"}
          </button>
        </div>
      </form>
    </Dialog>
  );
}

export default DeleteTechnicianDialog;
