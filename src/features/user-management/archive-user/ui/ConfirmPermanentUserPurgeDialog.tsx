import type { User } from "../../../../entities/user/user.types";
import ConfirmPermanentPurgeDialog from "../../../../shared/ui/ConfirmPermanentPurgeDialog";

interface ConfirmPermanentUserPurgeDialogProps {
  error: Error | null;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
  user: User | null;
}

function ConfirmPermanentUserPurgeDialog({
  error,
  isPending,
  onClose,
  onConfirm,
  user,
}: ConfirmPermanentUserPurgeDialogProps) {
  return (
    <ConfirmPermanentPurgeDialog
      confirmationInputLabel="User alias confirmation"
      entityLabel="user"
      entityName={user?.alias ?? null}
      error={error}
      impactMessage={
        <>
          Purging <strong>{user?.alias}</strong> permanently removes the Auth
          account and profile. The management audit trail is retained.
        </>
      }
      isPending={isPending}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
}

export default ConfirmPermanentUserPurgeDialog;
