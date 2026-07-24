import { useState } from "react";
import type { User } from "../../../../entities/user/user.types";
import { useNavigate } from "react-router";
import { useAuthPermissions } from "../../../auth/model/useAuthPermissions";
import { useArchiveUserMutation } from "../model/useUserArchiveMutations";
import { archiveButtonStyle } from "../../../../shared/styles/styles";
import ConfirmArchiveUserDialog from "./ConfirmArchiveUserDialog";

function ArchiveUserWithConfirmationButton({ user }: { user: User }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { canManageUsers } = useAuthPermissions();
  const archiveMutation = useArchiveUserMutation();

  if (!canManageUsers) return null;

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
      <button
        type="button"
        className={archiveButtonStyle}
        onClick={() => {
          archiveMutation.reset();
          setIsDialogOpen(true);
        }}
        aria-haspopup="dialog"
      >
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path d="M4 7.5h16M6 7.5v11h12v-11M9.5 11.5h5" />
          <path d="M4 4.5h16v3H4z" />
        </svg>
        Archive User
      </button>

      <ConfirmArchiveUserDialog
        user={user}
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
