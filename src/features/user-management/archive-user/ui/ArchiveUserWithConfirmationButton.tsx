import { useState } from "react";
import type { User } from "../../../../entities/user/user.types";
import { useNavigate } from "react-router";
import { useAuthPermissions } from "../../../auth/model/useAuthPermissions";
import { useArchiveUserMutation } from "../model/useUserArchiveMutations";
import ConfirmArchiveEntityDialog from "../../../../shared/ui/ConfirmArchiveEntityDialog";
import ArchiveButton from "../../../../shared/ui/ArchiveButton";
import { archiveEntityButtonStyle } from "../../../../shared/styles/styles";

function ArchiveUserWithConfirmationButton({ user }: { user: User }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { canManageUsers } = useAuthPermissions();
  const archiveMutation = useArchiveUserMutation();

  if (!canManageUsers) return null;

  const handleArchiveButtonClick = () => {
    archiveMutation.reset();
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    if (archiveMutation.isPending) return;
    archiveMutation.reset();
    setIsDialogOpen(false);
  };

  const handleConfirm = () => {
    archiveMutation.mutate(user.id, {
      onSuccess: () => {
        setIsDialogOpen(false);
        navigate("/users", { replace: true });
      },
    });
  };

  return (
    <>
      <ArchiveButton
        label="Archive User"
        handleClick={handleArchiveButtonClick}
        className={archiveEntityButtonStyle}
      />

      <ConfirmArchiveEntityDialog
        entityLabel="user"
        entityName={user.alias}
        confirmationMessageSubtext="User profile information will be preserved, but the user will be forbidden to use the app. You can restore this user from the archive at any time."
        isOpen={isDialogOpen}
        isPending={archiveMutation.isPending}
        error={archiveMutation.error}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </>
  );
}

export default ArchiveUserWithConfirmationButton;
