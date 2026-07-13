import { useMemo, useState } from "react";
import type { ServiceZone } from "../../../../entities/service-zone/service-zone.types";
import { useUpdateTechnicianServiceZonesMutation } from "../model/useUpdateTechnicianServiceZonesMutation";
import { buildTechnicianZonesPatch } from "../model/serviceZones.helpers";
import { formStyle } from "../../../../shared/styles/styles";
import SubmitArea from "../../ui/SubmitArea";
import SubmitSnackbar from "../../ui/SubmitSnackbar";
import ServiceZoneFields from "./ServiceZoneFields";

interface ServiceZonesFormProps {
  technicianId: string;
  zones: ServiceZone[];
  initialZoneIds: string[];
}

function ServiceZonesForm({
  technicianId,
  zones,
  initialZoneIds,
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
    <form className={`${formStyle} p-2`} onSubmit={handleSubmit} noValidate>
      <ServiceZoneFields
        zones={zones}
        selectedZoneIds={draftZoneIds}
        onChange={setZoneIds}
        disabled={isPending}
      />

      {/* Submit Area */}
      <SubmitArea
        error={updateTechnicianZonesMutation.error}
        isDirty={isDirty}
        isPending={isPending}
        handleDiscardChanges={handleDiscardChanges}
      />

      {/* Success Snackbar */}
      <SubmitSnackbar
        isOpen={isSavedSnackbarOpen}
        handleClose={() => setIsSavedSnackbarOpen(false)}
      />
    </form>
  );
}

export default ServiceZonesForm;
