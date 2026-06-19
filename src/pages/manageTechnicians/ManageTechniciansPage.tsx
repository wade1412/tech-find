import { useMemo, useState } from "react";
import ManageTechnicianCard from "../../features/technician-management/ui/ManageTechnicianCard";
import { useTechniciansQuery } from "../../entities/technician/useTechniciansQuery";
import PageHeader from "../../shared/ui/PageHeader";
import { useZoneNamesByTechnicianId } from "../../entities/technician-service-zone/useTechnicianZoneNames";
import ManageTechniciansSearch from "../../features/technician-management/ui/ManageTechniciansSearch";
import { filterTechniciansBySearch } from "../../features/technician-management/model/filterTechniciansBySearch";

function ManageTechniciansPage() {
  const {
    data: technicians,
    isPending: isTechniciansPending,
    isError: isTechniciansError,
    error: techniciansError,
  } = useTechniciansQuery();
  const {
    zoneNamesByTechnicianId,
    isPending: isZoneNamesPending,
    isError: isZoneNamesError,
    error: zoneNamesErrorObj,
  } = useZoneNamesByTechnicianId();

  const isPending = isTechniciansPending || isZoneNamesPending;
  const isError = isTechniciansError || isZoneNamesError;
  const error = techniciansError ?? zoneNamesErrorObj;

  const [openTechnicianId, setOpenTechnicianId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const visibleTechnicians = useMemo(
    () =>
      filterTechniciansBySearch(
        technicians ?? [],
        searchTerm,
        zoneNamesByTechnicianId,
      ),
    [technicians, searchTerm, zoneNamesByTechnicianId],
  );

  if (isPending) {
    return (
      <div className="mx-auto max-w-6xl p-4 md:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2">
              <div className="h-6 w-44 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-64 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <div className="h-10 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800 md:w-72" />
          </div>
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800"
              />
            ))}
          </div>
        </div>
      </div>
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
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <PageHeader
            title="Manage Technicians"
            subtitle="Select a technician to edit the data"
          />
          <ManageTechniciansSearch
            value={searchTerm}
            onValueChange={setSearchTerm}
            className="w-full md:w-72"
          />
        </div>

        {/* List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {visibleTechnicians.map((technician) => (
            <ManageTechnicianCard
              key={technician.id}
              technician={technician}
              zones={zoneNamesByTechnicianId.get(technician.id) || []}
              onToggle={() =>
                setOpenTechnicianId((prev) =>
                  prev === technician.id ? null : technician.id,
                )
              }
              isOpen={openTechnicianId === technician.id}
            />
          ))}

          {visibleTechnicians.length === 0 && (
            <p className="py-8 text-center text-sm text-zinc-400 dark:text-zinc-500 col-span-full">
              No technicians found
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default ManageTechniciansPage;
