import { useState } from "react";
import { useAuthPermissions } from "../../../auth/model/useAuthPermissions";
import type { ServiceZone } from "../../../../entities/service-zone/service-zone.types";
import { useServiceZonesQuery } from "../../../../entities/service-zone/useServiceZonesQuery";
import {
  usePurgeServiceZoneMutation,
  useRestoreServiceZoneMutation,
} from "../model/useServiceZoneArchiveMutations";
import ManageArchivedServiceEntitiesDialog from "../../archive-service-entity/ui/ManageArchivedServiceEntitiesDialog";
import ArchivedServiceEntityList from "../../archive-service-entity/ui/ArchivedServiceEntityList";
import ConfirmPermanentServiceZonePurgeDialog from "./ConfirmPermanentServiceZonePurgeDialog";

interface ManageArchivedZonesDialogProps {
  isOpen: boolean;
  onClose: () => void;
}
function ManageArchivedZonesDialog({
  isOpen,
  onClose,
}: ManageArchivedZonesDialogProps) {
  const { canPurgeServices } = useAuthPermissions();
  const [purgeTarget, setPurgeTarget] = useState<ServiceZone | null>(null);
  const archivedQuery = useServiceZonesQuery("archived", isOpen);
  const restoreMutation = useRestoreServiceZoneMutation();
  const purgeMutation = usePurgeServiceZoneMutation();
  const isMutating = restoreMutation.isPending || purgeMutation.isPending;

  const handleClose = () => {
    if (isMutating) return;
    restoreMutation.reset();
    purgeMutation.reset();
    setPurgeTarget(null);
    onClose();
  };

  const handlePurgeConfirm = () => {
    if (!purgeTarget) return;

    purgeMutation.mutate(purgeTarget.id, {
      onSuccess: () => setPurgeTarget(null),
    });
  };

  return (
    <>
      <ManageArchivedServiceEntitiesDialog
        title="Archived Service Zones"
        description="Restore service zones without losing their profile information or technician relations."
        isBusy={isMutating}
        isOpen={isOpen}
        onClose={handleClose}
        status={{
          isLoading: archivedQuery.isPending,
          errorMessage: archivedQuery.isError
            ? "Failed to load archived service zones."
            : undefined,
        }}
      >
        <ArchivedServiceEntityList
          copy={{
            emptyDescription: "Archived service zones will appear here.",
            entityLabel: "service zone",
            purgeDescription:
              "Owner-only permanent purge removes the service zone and cascades to its technician relations. It cannot be undone.",
          }}
          items={archivedQuery.data ?? []}
          onPurgeRequest={setPurgeTarget}
          onRestore={(id) => {
            restoreMutation.reset();
            restoreMutation.mutate(id);
          }}
          renderDetails={(zone) => (
            <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
              {zone.slug} · Filter order {zone.display_order}
            </p>
          )}
          state={{
            canPurge: canPurgeServices,
            isBusy: isMutating,
            restoreError: restoreMutation.isError,
            restoringId: restoreMutation.isPending
              ? restoreMutation.variables
              : undefined,
          }}
        />
      </ManageArchivedServiceEntitiesDialog>

      <ConfirmPermanentServiceZonePurgeDialog
        key={purgeTarget?.id ?? "closed"}
        zone={purgeTarget}
        isPending={purgeMutation.isPending}
        error={purgeMutation.error}
        onClose={() => {
          if (purgeMutation.isPending) return;
          purgeMutation.reset();
          setPurgeTarget(null);
        }}
        onConfirm={handlePurgeConfirm}
      />
    </>
  );
}

export default ManageArchivedZonesDialog;
