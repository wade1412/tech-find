import { useState } from "react";
import PageHeader from "../../shared/ui/PageHeader";
import EditTechnicianSectionCard from "./EditTechnicianSectionCard";
import { useParams } from "react-router";
import { useTechniciansQuery } from "../../entities/technician/useTechniciansQuery";
import NotFoundPage from "../NotFoundPage";
import { useZoneNamesByTechnicianId } from "../../entities/technician-service-zone/useZoneNamesByTechnicianId";
import ProfileAndCapabilitiesSection from "../../features/technician-management/profile-and-capabilities/ui/ProfileAndCapabilitiesSection";
import ServiceZonesSection from "../../features/technician-management/service-zones/ui/ServiceZonesSection";
import ErrorMessage from "../../shared/ui/ErrorMessage";

const editSections = [
  { id: "profile", title: "Profile & Capabilities" },
  { id: "service_zones", title: "Service Zones" },
  { id: "skills", title: "Skills" },
  { id: "ignore_list", title: "Ignore List" },
] as const;

type EditSectionId = (typeof editSections)[number]["id"];

function EditTechnicianPage() {
  const { technicianId } = useParams();
  const {
    data: allTechnicians,
    isPending: isTechniciansPending,
    isError: isTechniciansError,
    error: techniciansError,
  } = useTechniciansQuery("all");
  const {
    zoneNamesByTechnicianId,
    isPending: isZoneNamesPending,
    isError: isZoneNamesError,
    error: zoneNamesErrorObj,
  } = useZoneNamesByTechnicianId();

  const isPending = isTechniciansPending || isZoneNamesPending;
  const isError = isTechniciansError || isZoneNamesError;
  const error = techniciansError ?? zoneNamesErrorObj;

  const selectedTechnician = allTechnicians?.find(
    (tech) => tech.id === technicianId,
  );

  const [selectedSectionId, setSelectedSectionId] =
    useState<EditSectionId>("profile");

  if (isPending) {
    return (
      <div className="mx-auto max-w-6xl p-4 md:p-6">
        <section className="flex flex-col gap-4 p-4 md:p-6">
          <div className="h-7 w-32 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {[...Array(4)].map((_, i) => (
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
      <div className="mx-auto max-w-6xl p-4 md:p-6">
        <ErrorMessage message={error?.message} />
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
              onClick={() => setSelectedSectionId(section.id)}
            />
          ))}
        </div>

        {/* Selected Section */}
        {selectedSectionId === "profile" && (
          <ProfileAndCapabilitiesSection
            key={selectedTechnician.id}
            technician={selectedTechnician}
          />
        )}

        {selectedSectionId === "service_zones" && (
          <ServiceZonesSection
            key={selectedTechnician.id}
            technician={selectedTechnician}
          />
        )}
      </section>
    </div>
  );
}

export default EditTechnicianPage;
