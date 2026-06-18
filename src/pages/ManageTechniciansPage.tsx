import { useState } from "react";
import { useFilteredTechnicians } from "../features/technician-filter/model/useFilteredTechnicians";
import TechnicianSkeleton from "../entities/technician/ui/TechnicianSkeleton";
import ManageTechnicianCard from "../features/technician-management/ui/ManageTechnicianCard";

function ManageTechniciansPage() {
  const {
    filteredTechnicians,
    technicianZonesNames,
    isPending,
    isError,
    error,
  } = useFilteredTechnicians();

  const [openTechnicianId, setOpenTechnicianId] = useState<string | null>(null);

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
      <div className="grid grid-cols-3 gap-2">
        {filteredTechnicians.map((technician) => (
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
