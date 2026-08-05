import { useState } from "react";
import type { Unit } from "../../../../entities/unit/unit.types";
import { archivedManagementItemsButtonStyle } from "../../../../shared/styles/styles";
import ArchiveButton from "../../../../shared/ui/ArchiveButton";
import { useAuthPermissions } from "../../../auth/model/useAuthPermissions";
import ManageArchivedSpecificIssuesDialog from "./ManageArchivedSpecificIssuesDialog";

function OpenArchivedSpecificIssuesDialogButton({
  unitsById,
}: {
  unitsById: ReadonlyMap<string, Unit>;
}) {
  const { canArchiveServices } = useAuthPermissions();
  const [isOpen, setIsOpen] = useState(false);

  if (!canArchiveServices) return null;

  return (
    <>
      <ArchiveButton
        label="Archived Issues"
        handleClick={() => setIsOpen(true)}
        className={archivedManagementItemsButtonStyle}
      />

      <ManageArchivedSpecificIssuesDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        unitsById={unitsById}
      />
    </>
  );
}

export default OpenArchivedSpecificIssuesDialogButton;
