import { useState } from "react";
import { useTechniciansQuery } from "../useTechniciansQuery";
import TechnicianCard from "./TechnicianCard";

function TechnicianList() {
  const { data, isPending, isError, error } = useTechniciansQuery();

  const [openTechnicianId, setOpenTechnicianId] = useState<string | null>(null);

  if (isPending) return <h1>Loading...</h1>;

  if (isError) return <p>{error.message}</p>;

  return (
    <div className="flex flex-col gap-4">
      {data &&
        data.length > 0 &&
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
        ))}
    </div>
  );
}

export default TechnicianList;
