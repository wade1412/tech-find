import { useState } from "react";
import { archivedManagementItemsButtonStyle } from "../../../../shared/styles/styles";
import ArchiveButton from "../../../../shared/ui/ArchiveButton";
import { useAuthPermissions } from "../../../auth/model/useAuthPermissions";
import ManageArchivedZonesDialog from "./ManageArchivedZonesDialog";

function OpenArchivedZonesDialog() {
  const { canArchiveServices } = useAuthPermissions();
  const [isOpen, setIsOpen] = useState(false);

  if (!canArchiveServices) return null;

  return (
    <>
      <ArchiveButton
        label="Archived Service Zones"
        handleClick={() => setIsOpen(true)}
        className={`${archivedManagementItemsButtonStyle} min-w-52!`}
      />

      <ManageArchivedZonesDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}

export default OpenArchivedZonesDialog;
