import { useServiceZonesQuery } from "../../../../entities/service-zone/useServiceZonesQuery";
import { useZoneNamesByTechnicianId } from "../../../../entities/technician-service-zone/useZoneNamesByTechnicianId";
import type { Technician } from "../../../../entities/technician/technician.types";
import { useUpdateTechnicianMutation } from "../../model/useUpdateTechnicianMutation";
import { useState } from "react";
import ServiceZonesForm from "./ServiceZonesForm";

interface ServiceZonesSectionProps {
  technician: Technician;
}

function ServiceZonesSection({ technician }: ServiceZonesSectionProps) {
  const {
    zoneIdsByTechId,
    isPending: isZoneNamesPending,
    isError: isZoneNamesError,
    error: zoneNamesErrorObj,
  } = useZoneNamesByTechnicianId();
  const {
    data: zones,
    isPending: isZonesPending,
    isError: isZonesError,
    error: zonesErrorObject,
  } = useServiceZonesQuery();

  const initialZoneIds = Array.from(zoneIdsByTechId.get(technician.id) ?? []);
  const [currentZoneIds, setZoneIds] = useState<string[]>(initialZoneIds);

  // Get zones object array for this technician, based on current zone ids
  const technicianZones = (zones ?? []).filter((zone) => {
    return zone && new Set(currentZoneIds)?.has(zone.id);
  });

  const handleAddZone = (newValue: string) =>
    setZoneIds((prev) => (prev ? [...prev, newValue] : [newValue]));

  const handleZoneDelete = (zoneId: string) => {
    if (!zoneId) return;
    setZoneIds((prev) => prev.filter((p) => p !== zoneId));
  };

  const updateTechnicianMutation = useUpdateTechnicianMutation();
  const isPending = updateTechnicianMutation.isPending;

  if (isZoneNamesPending || isZonesPending) {
    return <div>loading</div>;
  }
  if (isZoneNamesError || isZonesError) {
    return <div>{(zoneNamesErrorObj ?? zonesErrorObject)?.message}</div>;
  }

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
      <ServiceZonesForm
        zones={zones}
        technicianZones={technicianZones || []}
        currentZonesIds={currentZoneIds}
        handleAddZone={handleAddZone}
        handleZoneDelete={handleZoneDelete}
      />

      {/* Submit Button */}
      <div className="flex flex-col gap-2 items-center justify-center p-2">
        <button
          type="submit"
          disabled={isPending}
          className="bg-main-500 hover:bg-main-400 focus-visible:ring-main-500 cursor-pointer rounded-xl px-4 py-2.5 text-xs font-semibold text-zinc-950 transition-[background-color,transform,opacity] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>

        {updateTechnicianMutation.error && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50/50 p-4 text-xs font-medium text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
          >
            Failed to save changes. Try again
          </p>
        )}
      </div>
    </form>
  );
}

export default ServiceZonesSection;
