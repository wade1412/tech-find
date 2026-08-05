import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuthPermissions } from "../../../auth/model/useAuthPermissions";
import { useArchiveServiceZoneMutation } from "../model/useServiceZoneArchiveMutations";
import type { ServiceZone } from "../../../../entities/service-zone/service-zone.types";
import ArchiveButton from "../../../../shared/ui/ArchiveButton";
import { archiveEntityButtonStyle } from "../../../../shared/styles/styles";
import ConfirmArchiveEntityDialog from "../../../../shared/ui/ConfirmArchiveEntityDialog";

function ArchiveZoneWithConfirmationButton({ zone }: { zone: ServiceZone }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { canArchiveServices } = useAuthPermissions();
  const archiveMutation = useArchiveServiceZoneMutation();

  if (!canArchiveServices) return null;

  const handleClose = () => {
    if (archiveMutation.isPending) return null;
    archiveMutation.reset();
    setIsDialogOpen(false);
  };

  const handleConfirm = () => {
    archiveMutation.mutate(zone.id, {
      onSuccess: () => {
        setIsDialogOpen(false);
        navigate("/services", { replace: true });
      },
    });
  };

  return (
    <>
      <ArchiveButton
        label="Archive Service Zone"
        handleClick={() => {
          archiveMutation.reset();
          setIsDialogOpen(true);
        }}
        className={archiveEntityButtonStyle}
      />

      <ConfirmArchiveEntityDialog
        entityLabel="service zone"
        entityName={zone.name}
        confirmationMessageSubtext="The zone and its related configuration will be preserved, but it will be removed from Home filters and service-management lists. You can restore it at any time."
        isOpen={isDialogOpen}
        isPending={archiveMutation.isPending}
        error={archiveMutation.error}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    </>
  );
}

export default ArchiveZoneWithConfirmationButton;
