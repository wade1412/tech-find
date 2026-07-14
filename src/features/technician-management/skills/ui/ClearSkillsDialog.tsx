import { Dialog } from "@mui/material";
import {
  destructiveButton,
  secondaryButton,
} from "../../../../shared/styles/styles";

interface ClearSkillsDialogProps {
  isOpen: boolean;
  skillsCount: number;
  onClose: () => void;
  onConfirm: () => void;
}

function ClearSkillsDialog({
  isOpen,
  skillsCount,
  onClose,
  onConfirm,
}: ClearSkillsDialogProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="clear-skills-title"
      aria-describedby="clear-skills-description"
      slotProps={{
        paper: {
          sx: {
            width: "100%",
            maxWidth: "28rem",
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
            id="clear-skills-title"
            className="font-heading text-base font-semibold text-zinc-900 dark:text-zinc-50"
          >
            Clear all skills?
          </h2>
          <p
            id="clear-skills-description"
            className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400"
          >
            This will remove all {skillsCount} skills from the new technician
            draft.
          </p>
        </div>

        <div className="flex flex-col-reverse gap-2 px-5 py-4 sm:flex-row sm:justify-end">
          <button type="button" className={secondaryButton} onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className={destructiveButton}
            onClick={onConfirm}
          >
            Clear all skills
          </button>
        </div>
      </div>
    </Dialog>
  );
}

export default ClearSkillsDialog;
