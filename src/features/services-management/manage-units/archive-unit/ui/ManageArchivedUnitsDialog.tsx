import { useState } from "react";
import type { Unit } from "../../../../../entities/unit/unit.types";
import { useUnitsQuery } from "../../../../../entities/unit/useUnitsQuery";
import ManageArchivedServiceEntitiesDialog from "../../../archive-service-entity/ui/ManageArchivedServiceEntitiesDialog";
import { useAuthPermissions } from "../../../../auth/model/useAuthPermissions";
import {
  usePurgeUnitMutation,
  useRestoreUnitMutation,
} from "../model/useUnitArchiveMutations";
import ConfirmPermanentUnitPurgeDialog from "./ConfirmPermanentUnitPurgeDialog";

interface ManageArchivedUnitsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function ManageArchivedUnitsDialog({
  isOpen,
  onClose,
}: ManageArchivedUnitsDialogProps) {
  const { canPurgeServices } = useAuthPermissions();
  const [purgeTarget, setPurgeTarget] = useState<Unit | null>(null);
  const archivedQuery = useUnitsQuery("archived", isOpen);
  const restoreMutation = useRestoreUnitMutation();
  const purgeMutation = usePurgeUnitMutation();
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
        archiveDescription="Restore units without losing display order, capabilities, specific issues, or technician configuration."
        canPurge={canPurgeServices}
        entityLabel="unit"
        entityPluralLabel="units"
        isError={archivedQuery.isError}
        isLoading={archivedQuery.isPending}
        isMutating={isMutating}
        isOpen={isOpen}
        items={archivedQuery.data ?? []}
        onClose={handleClose}
        onPurgeRequest={setPurgeTarget}
        onRestore={(id) => {
          restoreMutation.reset();
          restoreMutation.mutate(id);
        }}
        purgeDescription="Owner-only permanent purge removes the unit and cascades to its specific issues, technician skills, and ignore-list references. It cannot be undone."
        renderDetails={(unit) => (
          <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
            {unit.slug} · Filter order {unit.display_order}
          </p>
        )}
        restoreError={restoreMutation.isError}
        restoringId={
          restoreMutation.isPending ? restoreMutation.variables : undefined
        }
      />

      <ConfirmPermanentUnitPurgeDialog
        key={purgeTarget?.id ?? "closed"}
        unit={purgeTarget}
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

export default ManageArchivedUnitsDialog;
