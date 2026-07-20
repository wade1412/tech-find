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
import SkillsSection from "../../features/technician-management/skills/ui/SkillsSection";
import IgnoreListSection from "../../features/technician-management/ignore-list/ui/IgnoreListSection";
import {
  editSections,
  type EditSectionId,
} from "../../features/technician-management/model/manageTechnicians.constants";
import EditTechnicianSkeleton from "../../features/technician-management/ui/EditTechnicianSkeleton";
import ArchiveTechnicianWithConfirmationButton from "../../features/technician-management/archive-technician/ui/ArchiveTechnicianWithConfirmationButton";
import { centeredContainerStyle } from "../../shared/styles/styles";

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
    return <EditTechnicianSkeleton />;
  }

  if (isError) {
    return (
      <div className={centeredContainerStyle}>
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
    <div className={centeredContainerStyle}>
      <section className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
          <PageHeader
            title={selectedTechnician?.alias || "Technician Alias"}
            subtitle={subtitle}
          />
          <ArchiveTechnicianWithConfirmationButton
            technician={selectedTechnician}
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

        {selectedSectionId === "skills" && (
          <SkillsSection
            key={selectedTechnician.id}
            technician={selectedTechnician}
          />
        )}

        {selectedSectionId === "ignore_list" && (
          <IgnoreListSection
            key={selectedTechnician.id}
            technician={selectedTechnician}
          />
        )}
      </section>
    </div>
  );
}

export default EditTechnicianPage;
