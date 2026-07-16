import { useState } from "react";
import { useNavigate } from "react-router";
import type { Technician } from "../../../../entities/technician/technician.types";
import { useAuthPermissions } from "../../../auth/model/useAuthPermissions";
import { useArchiveTechnicianMutation } from "../model/useTechnicianArchiveMutations";
import ConfirmArchiveTechnicianDialog from "./ConfirmArchiveTechnicianDialog";

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
        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-zinc-300 bg-transparent px-4 py-3 text-xs font-semibold text-zinc-600 transition-[background-color,border-color,color,opacity,transform] hover:border-amber-400 hover:bg-amber-50 hover:text-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 active:scale-[0.98] dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-amber-700 dark:hover:bg-amber-950/25 dark:hover:text-amber-300 dark:focus-visible:ring-offset-zinc-950"
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

      <ConfirmArchiveTechnicianDialog
        technician={technician}
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
