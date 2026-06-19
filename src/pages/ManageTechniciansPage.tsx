import { useMemo, useState } from "react";
import ManageTechnicianCard from "../features/technician-management/ui/ManageTechnicianCard";
import { useTechniciansQuery } from "../entities/technician/useTechniciansQuery";
import { useServiceZonesQuery } from "../entities/service-zone/useServiceZonesQuery";
import { useTechnicianServiceZonesQuery } from "../entities/technician-service-zone/useTechnicianServiceZonesQuery";
import { createTechnicianZoneNamesMap } from "../entities/technician-service-zone/technician-service-zone.helpers";
import PageHeader from "../shared/ui/PageHeader";

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
    return (
      <section className="flex flex-col gap-4 p-4 md:p-6">
        <div className="h-7 w-32 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800"
            />
          ))}
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400">
        {error?.message}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6">
      <section className="flex flex-col gap-4">
        <div>
          <PageHeader
            title="Manage Technicians"
            subtitle="Select a technician to edit the data"
          />
          {/* Search Input */}
          <div>Search Input</div>
        </div>

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
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
    </div>
  );
}

export default ManageTechniciansPage;
