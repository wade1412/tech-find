import { useState } from "react";
import { useAuthPermissions } from "../../../auth/model/useAuthPermissions";
import ManageArchivedTechniciansDialog from "./ManageArchivedTechniciansDialog";
import { archivedTechniciansButtonStyle } from "../../../../shared/styles/styles";

function OpenArchivedTechniciansDialogButton() {
  const { canArchiveTechnicians } = useAuthPermissions();
  const [isOpen, setIsOpen] = useState(false);

  if (!canArchiveTechnicians) return null;

  return (
    <>
      <button
        type="button"
        className={archivedTechniciansButtonStyle}
        onClick={() => setIsOpen(true)}
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
        Archived Technicians
      </button>

      <ManageArchivedTechniciansDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

export default OpenArchivedTechniciansDialogButton;
