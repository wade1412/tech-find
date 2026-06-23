import { useState } from "react";
import PageHeader from "../../shared/ui/PageHeader";
import EditTechnicianSectionCard from "./EditTechnicianSectionCard";
import { useParams } from "react-router";
import { useTechniciansQuery } from "../../entities/technician/useTechniciansQuery";
import NotFoundPage from "../NotFoundPage";
import { useZoneNamesByTechnicianId } from "../../entities/technician-service-zone/useZoneNamesByTechnicianId";
import ProfileAndCapacitiesSection from "./ProfileAndCapacitiesSection";

const editSections = [
  { id: "profile", title: "Profile & Capacities" },
  { id: "service_zones", title: "Service Zones" },
  { id: "skills", title: "Skills" },
  { id: "ignore_list", title: "Ignore List" },
];

function EditTechnicianPage() {
  const { technicianId } = useParams();
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

  const selectedTechnician = technicians?.find(
    (tech) => tech.id === technicianId,
  );

  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null,
  );

  const onSectionToggle = (id: string) =>
    setSelectedSectionId((prev) => (prev === id ? null : id));

  if (isPending) {
    return (
      <div className="mx-auto max-w-6xl p-4 md:p-6">
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

  if (!selectedTechnician) {
    return <NotFoundPage />;
  }

  const zoneNames = zoneNamesByTechnicianId.get(selectedTechnician.id) ?? [];
  const subtitle = `ZIP ${selectedTechnician.home_zip_code} · ${zoneNames.join(" - ")}`;

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6">
      <section className="flex flex-col gap-4">
        {/* Header */}
        <div>
          <PageHeader
            title={selectedTechnician?.alias || "Technician Alias"}
            subtitle={subtitle}
          />
        </div>

        {/* Sections Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {editSections.map((section) => (
            <EditTechnicianSectionCard
              key={section.id}
              id={section.id}
              title={section.title}
              selectedSectionId={selectedSectionId}
              onToggle={() => onSectionToggle(section.id)}
            />
          ))}
        </div>

        {/* Selected Section */}
        {selectedSectionId === "profile" && (
          <ProfileAndCapacitiesSection technician={selectedTechnician} />
        )}
      </section>
    </div>
  );
}

export default EditTechnicianPage;
