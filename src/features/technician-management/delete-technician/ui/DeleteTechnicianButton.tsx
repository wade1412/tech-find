import { useState } from "react";
import { useNavigate } from "react-router";
import type { Technician } from "../../../../entities/technician/technician.types";
import { useAuthPermissions } from "../../../auth/model/useAuthPermissions";
import { destructiveOutlineButton } from "../../../../shared/styles/styles";
import { useDeleteTechnicianMutation } from "../model/useDeleteTechnicianMutation";
import DeleteTechnicianDialog from "./DeleteTechnicianDialog";

interface DeleteTechnicianButtonProps {
  technician: Technician;
}

function DeleteTechnicianButton({
  technician,
}: DeleteTechnicianButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { canDeleteTechnicians } = useAuthPermissions();
  const deleteTechnicianMutation = useDeleteTechnicianMutation();

  if (!canDeleteTechnicians) return null;

  const handleOpen = () => {
    deleteTechnicianMutation.reset();
    setIsDialogOpen(true);
  };

  const handleClose = () => {
    if (deleteTechnicianMutation.isPending) return;

    deleteTechnicianMutation.reset();
    setIsDialogOpen(false);
  };

  const handleConfirm = () => {
    deleteTechnicianMutation.mutate(technician.id, {
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
        className={destructiveOutlineButton}
        onClick={handleOpen}
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
          <path strokeLinecap="round" d="M4 7h16M9 7V4h6v3" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.5 7 7.5 20h9l1-13M10 11v5M14 11v5"
          />
        </svg>
        Delete technician
      </button>

      <DeleteTechnicianDialog
        isOpen={isDialogOpen}
        technicianAlias={technician.alias}
        isPending={deleteTechnicianMutation.isPending}
        error={deleteTechnicianMutation.error}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </>
  );
}

export default DeleteTechnicianButton;
