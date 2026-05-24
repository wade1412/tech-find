import { useState } from "react";
import { useTechniciansQuery } from "../useTechniciansQuery";
import TechnicianCard from "./TechnicianCard";
import TechnicianSkeleton from "./TechnicianSkeleton";

function TechnicianList() {
  const { data, isPending, isError, error } = useTechniciansQuery();

  const [openTechnicianId, setOpenTechnicianId] = useState<string | null>(null);

  if (isPending) return <TechnicianSkeleton />;

  if (isError)
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400">
        {error.message}
      </div>
    );

  return (
    <div className="flex flex-col gap-2.5">
      {data && data.length > 0 ? (
        data.map((technician) => (
          <TechnicianCard
            key={technician.id}
            technician={technician}
            isOpen={openTechnicianId === technician.id}
            //Toggle open on click
            onToggle={() =>
              setOpenTechnicianId((prev) =>
                prev === technician.id ? null : technician.id,
              )
            }
          />
        ))
      ) : (
        <p className="py-8 text-center text-sm text-zinc-400 dark:text-zinc-500">
          No technicians found
        </p>
      )}
    </div>
  );
}

export default TechnicianList;
