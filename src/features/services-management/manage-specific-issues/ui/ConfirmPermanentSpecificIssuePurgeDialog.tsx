import type { SpecificIssue } from "../../../../entities/specific-issue/specific-issue.types";
import ConfirmPermanentPurgeDialog from "../../../../shared/ui/ConfirmPermanentPurgeDialog";

interface ConfirmPermanentSpecificIssuePurgeDialogProps {
  error: Error | null;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
  specificIssue: SpecificIssue | null;
}

function ConfirmPermanentSpecificIssuePurgeDialog({
  error,
  isPending,
  onClose,
  onConfirm,
  specificIssue,
}: ConfirmPermanentSpecificIssuePurgeDialogProps) {
  return (
    <ConfirmPermanentPurgeDialog
      confirmationInputLabel="Specific issue name confirmation"
      entityLabel="specific issue"
      entityName={specificIssue?.name ?? null}
      error={error}
      impactMessage={
        <>
          Purging <strong>{specificIssue?.name}</strong> permanently removes the
          issue, technician skills, and ignore-list references.
        </>
      }
      isPending={isPending}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}

export default ConfirmPermanentSpecificIssuePurgeDialog;
