import { useEffect, useMemo, useState } from "react";
import type { ServiceZone } from "../../../../entities/service-zone/service-zone.types";
import { useUpdateTechnicianServiceZonesMutation } from "../model/useUpdateTechnicianServiceZonesMutation";
import { buildTechnicianZonesPatch } from "../model/serviceZones.helpers";
import { formWithPaddingStyle } from "../../../../shared/styles/styles";
import FormSubmitArea from "../../../../shared/ui/FormSubmitArea";
import SaveSuccessSnackbar from "../../../../shared/ui/SaveSuccessSnackbar";
import ServiceZoneFields from "./ServiceZoneFields";

interface ServiceZonesFormProps {
  technicianId: string;
  zones: ServiceZone[];
  initialZoneIds: string[];
  onDirtyChange?: (isDirty: boolean) => void;
}

function ServiceZonesForm({
  technicianId,
  zones,
  initialZoneIds,
  onDirtyChange,
}: ServiceZonesFormProps) {
  const [draftZoneIds, setZoneIds] = useState<string[]>(initialZoneIds);
  const [isSavedSnackbarOpen, setIsSavedSnackbarOpen] = useState(false);

  const updateTechnicianZonesMutation =
    useUpdateTechnicianServiceZonesMutation();

  //Zone Ids Sets
  const initialZoneIdsSet = useMemo(
    () => new Set(initialZoneIds),
    [initialZoneIds],
  );
  const draftZoneIdsSet = useMemo(() => new Set(draftZoneIds), [draftZoneIds]);

  const patch = useMemo(
    () => buildTechnicianZonesPatch(initialZoneIdsSet, draftZoneIdsSet),
    [initialZoneIdsSet, draftZoneIdsSet],
  );

  const isDirty = patch.addedIds.length > 0 || patch.removedIds.length > 0;
  const isPending = updateTechnicianZonesMutation.isPending;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const handleDiscardChanges = () => {
    setZoneIds(initialZoneIds);
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isDirty || isPending) return;

    updateTechnicianZonesMutation.mutate(
      {
        technicianId,
        ...patch,
      },
      {
        onSuccess: () => {
          setIsSavedSnackbarOpen(true);
        },
      },
    );
  };

  return (
    <form className={formWithPaddingStyle} onSubmit={handleSubmit} noValidate>
      <ServiceZoneFields
        zones={zones}
        selectedZoneIds={draftZoneIds}
        onChange={setZoneIds}
        disabled={isPending}
      />

      {/* Submit Area */}
      <FormSubmitArea
        error={updateTechnicianZonesMutation.error}
        isDirty={isDirty}
        isPending={isPending}
        onDiscard={handleDiscardChanges}
      />

      {/* Success Snackbar */}
      <SaveSuccessSnackbar
        isOpen={isSavedSnackbarOpen}
        onClose={() => setIsSavedSnackbarOpen(false)}
      />
    </form>
  );
}

export default ServiceZonesForm;
