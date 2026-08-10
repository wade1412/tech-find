import { useId, useState, type SubmitEvent } from "react";
import { Dialog, TextField } from "@mui/material";
import { destructiveButton, secondaryButton } from "../styles/styles";

interface ConfirmPermanentPurgeDialogProps {
  confirmationInputLabel: string;
  entityLabel: string;
  entityName: string | null;
  error: Error | null;
  impactMessage: React.ReactNode;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function ConfirmPermanentPurgeDialog({
  confirmationInputLabel,
  entityLabel,
  entityName,
  error,
  impactMessage,
  isPending,
  onClose,
  onConfirm,
}: ConfirmPermanentPurgeDialogProps) {
  const dialogId = useId();
  const titleId = `${dialogId}-title`;
  const descriptionId = `${dialogId}-description`;
  const confirmationInputId = `${dialogId}-confirmation`;
  const [confirmationValue, setConfirmationValue] = useState("");
  const normalizedEntityLabel = entityLabel.toLowerCase();
  const canConfirm =
    Boolean(entityName) && confirmationValue.trim() === entityName;

  const handleClose = () => {
    if (isPending) return;
    setConfirmationValue("");
    onClose();
  };

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canConfirm || isPending) return;
    onConfirm();
  };

  return (
    <Dialog
      open={Boolean(entityName)}
      onClose={handleClose}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
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
            id={titleId}
            className="font-heading text-base font-semibold text-zinc-900 dark:text-zinc-50"
          >
            Permanently purge {normalizedEntityLabel}?
          </h2>
          <p
            id={descriptionId}
            className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400"
          >
            This owner-only action cannot be undone.
          </p>
        </div>

        <div className="flex flex-col gap-4 px-5 py-5">
          <div className="rounded-xl border border-red-200 bg-red-50/70 px-3.5 py-3 text-xs leading-5 text-red-700 dark:border-red-900/50 dark:bg-red-950/25 dark:text-red-300">
            {impactMessage}
          </div>

          <div>
            <label
              htmlFor={confirmationInputId}
              className="mb-2 block text-xs font-medium text-zinc-600 dark:text-zinc-300"
            >
              Type <strong>{entityName}</strong> to confirm
            </label>
            <TextField
              id={confirmationInputId}
              value={confirmationValue}
              onChange={(event) => setConfirmationValue(event.target.value)}
              disabled={isPending}
              autoFocus
              autoComplete="off"
              fullWidth
              size="small"
              placeholder={entityName ?? undefined}
              slotProps={{
                htmlInput: {
                  "aria-label": confirmationInputLabel,
                },
              }}
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50/70 px-3 py-2 text-xs font-medium text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
            >
              Failed to purge {normalizedEntityLabel}. Please try again.
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

export default ConfirmPermanentPurgeDialog;
