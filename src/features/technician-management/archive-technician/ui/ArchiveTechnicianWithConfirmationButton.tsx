import { useState } from "react";
import { useNavigate } from "react-router";
import type { Technician } from "../../../../entities/technician/technician.types";
import { useAuthPermissions } from "../../../auth/model/useAuthPermissions";
import { useArchiveTechnicianMutation } from "../model/useTechnicianArchiveMutations";
import { archiveButtonStyle } from "../../../../shared/styles/styles";
import ConfirmArchiveEntityDialog from "../../../../shared/ui/ConfirmArchiveEntityDialog";

interface ArchiveTechnicianWithConfirmationButtonProps {
  technician: Technician;
}

function ArchiveTechnicianWithConfirmationButton({
  technician,
}: ArchiveTechnicianWithConfirmationButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { canArchiveTechnicians } = useAuthPermissions();
  const archiveMutation = useArchiveTechnicianMutation();

  if (!canArchiveTechnicians) return null;

  const handleClose = () => {
    if (archiveMutation.isPending) return;
    archiveMutation.reset();
    setIsDialogOpen(false);
  };

  const handleConfirm = () => {
    archiveMutation.mutate(technician.id, {
      onSuccess: () => {
        setIsDialogOpen(false);
        navigate("/technicians", { replace: true });
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
        Archive technician
      </button>

      <ConfirmArchiveEntityDialog
        entityLabel="technician"
        entityName={technician.alias}
        confirmationMessageSubtext=" Service zones, skills, and ignore-list items will be preserved, but the technician will be excluded from jobs matching. You can restore this technician from the archive at any time."
        isOpen={isDialogOpen}
        isPending={archiveMutation.isPending}
        error={archiveMutation.error}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </>
  );
}

export default ArchiveTechnicianWithConfirmationButton;
