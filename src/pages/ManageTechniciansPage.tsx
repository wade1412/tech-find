import { useMemo, useState } from "react";
import TechnicianSkeleton from "../entities/technician/ui/TechnicianSkeleton";
import ManageTechnicianCard from "../features/technician-management/ui/ManageTechnicianCard";
import { useTechniciansQuery } from "../entities/technician/useTechniciansQuery";
import { useServiceZonesQuery } from "../entities/service-zone/useServiceZonesQuery";
import { useTechnicianServiceZonesQuery } from "../entities/technician-service-zone/useTechnicianServiceZonesQuery";
import { createTechnicianZoneNamesMap } from "../entities/technician-service-zone/technician-service-zone.helpers";

function ManageTechniciansPage() {
  const {
    data: technicians,
    isPending: isTechniciansPending,
    isError: isTechniciansError,
    error: techniciansError,
  } = useTechniciansQuery();
  const {
    data: zones,
    isPending: isZonesPending,
    isError: isZonesError,
    error: zonesError,
  } = useServiceZonesQuery();
  const {
    data: technicianZones,
    isPending: isTechnicianZonesPending,
    isError: isTechnicianZonesError,
    error: technicianZonesError,
  } = useTechnicianServiceZonesQuery();

  const technicianZonesNames = useMemo(
    () => createTechnicianZoneNamesMap(zones ?? [], technicianZones ?? []),
    [zones, technicianZones],
  );

  const [openTechnicianId, setOpenTechnicianId] = useState<string | null>(null);

  const isPending =
    isTechniciansPending || isZonesPending || isTechnicianZonesPending;
  const isError = isTechniciansError || isZonesError || isTechnicianZonesError;
  const error = techniciansError ?? zonesError ?? technicianZonesError;

  if (isPending) {
    return <TechnicianSkeleton />;
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400">
        {error?.message}
      </div>
    );
  }

  return (
    <section className="flex flex-col p-4 md:p-6 gap-4">
      <div>
        <h1 className="font-heading tracking-wider text-xl font-semibold">
          Technicians
        </h1>

        {/* Search Input */}
        <div>Search Input</div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {technicians.map((technician) => (
          <ManageTechnicianCard
            key={technician.id}
            technician={technician}
            zones={technicianZonesNames.get(technician.id) || []}
            onToggle={() =>
              setOpenTechnicianId((prev) =>
                prev === technician.id ? null : technician.id,
              )
            }
            isOpen={openTechnicianId === technician.id}
          />
        ))}
      </div>
    </section>
  );
}

export default ManageTechniciansPage;
