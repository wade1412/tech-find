import { useState } from "react";
import PageHeader from "../../shared/ui/PageHeader";
import EditSectionCard from "../../shared/ui/EditSectionCard";
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
  editTechnicianSections,
  type EditTechnicianSectionId,
} from "../../features/technician-management/model/manageTechnicians.constants";
import EditTechnicianSkeleton from "../../features/technician-management/ui/EditTechnicianSkeleton";
import ArchiveTechnicianWithConfirmationButton from "../../features/technician-management/archive-technician/ui/ArchiveTechnicianWithConfirmationButton";
import {
  centeredContainerStyle,
  editHeaderWithButtonContainerStyle,
  editSectionListStyle,
  formStyle,
} from "../../shared/styles/styles";
import { useUnsavedChangesGuard } from "../../shared/hooks/useUnsavedChangesGuard";
import UnsavedChangesDialog from "../../shared/ui/UnsavedChangesDialog";

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
    useState<EditTechnicianSectionId>("profile");
  const [activeSectionIsDirty, setActiveSectionIsDirty] = useState(false);
  const unsavedChanges = useUnsavedChangesGuard(activeSectionIsDirty);

  const handleSectionChange = (sectionId: EditTechnicianSectionId) => {
    if (sectionId === selectedSectionId) return;

    unsavedChanges.requestAction(() => {
      setActiveSectionIsDirty(false);
      setSelectedSectionId(sectionId);
    });
  };

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
    <>
      <div className={centeredContainerStyle}>
      <section className={formStyle}>
        {/* Header */}
        <div className={editHeaderWithButtonContainerStyle}>
          <PageHeader
            title={selectedTechnician?.alias || "Technician Alias"}
            subtitle={subtitle}
          />
          <ArchiveTechnicianWithConfirmationButton
            technician={selectedTechnician}
          />
        </div>

        {/* Sections Cards */}
        <div className={editSectionListStyle}>
          {editTechnicianSections.map((section) => (
            <EditSectionCard
              key={section.id}
              id={section.id}
              title={section.title}
              selectedSectionId={selectedSectionId}
              onClick={() => handleSectionChange(section.id)}
            />
          ))}
        </div>

        {/* Selected Section */}
        {selectedSectionId === "profile" && (
          <ProfileAndCapabilitiesSection
            key={selectedTechnician.id}
            technician={selectedTechnician}
            onDirtyChange={setActiveSectionIsDirty}
          />
        )}

        {selectedSectionId === "service_zones" && (
          <ServiceZonesSection
            key={selectedTechnician.id}
            technician={selectedTechnician}
            onDirtyChange={setActiveSectionIsDirty}
          />
        )}

        {selectedSectionId === "skills" && (
          <SkillsSection
            key={selectedTechnician.id}
            technician={selectedTechnician}
            onDirtyChange={setActiveSectionIsDirty}
          />
        )}

        {selectedSectionId === "ignore_list" && (
          <IgnoreListSection
            key={selectedTechnician.id}
            technician={selectedTechnician}
            onDirtyChange={setActiveSectionIsDirty}
          />
        )}
      </section>
      </div>

      <UnsavedChangesDialog
        isOpen={unsavedChanges.isDialogOpen}
        onLeave={unsavedChanges.leave}
        onStay={unsavedChanges.stay}
      />
    </>
  );
}

export default EditTechnicianPage;
