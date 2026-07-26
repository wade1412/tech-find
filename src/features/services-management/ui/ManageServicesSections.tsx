import { useState } from "react";
import { editSectionListStyle, formStyle } from "../../../shared/styles/styles";
import ErrorMessage from "../../../shared/ui/ErrorMessage";
import { useManageServicesData } from "../model/useManageServicesData";
import {
  editServicesSections,
  type EditServicesSectionId,
} from "../model/manageServices.constants";
import EditSectionCard from "../../../shared/ui/EditSectionCard";
import ManageUnitsSection from "../manage-units/ui/ManageUnitsSection";
import ManageBrandsSection from "../manage-brands/ui/ManageBrandsSection";
import ManageSpecificIssuesSection from "../manage-specific-issues/ui/ManageSpecificIssuesSection";
import ManageServiceZonesSection from "../manage-service-zones/ui/ManageServiceZonesSection";

function ManageServicesSections() {
  const {
    units,
    brands,
    brandGroups,
    specificIssues,
    zones,
    isPending,
    isError,
    error,
  } = useManageServicesData();
  const [selectedSectionId, setSelectedSectionId] =
    useState<EditServicesSectionId>("units");

  if (isPending) return <div>Loading...</div>;
  if (isError) return <ErrorMessage message={error?.message} />;

  return (
    <div className={formStyle}>
      {/* Sections Cards */}
      <div className={editSectionListStyle}>
        {editServicesSections.map((section) => (
          <EditSectionCard
            key={section.id}
            id={section.id}
            title={section.title}
            selectedSectionId={selectedSectionId}
            onClick={() => setSelectedSectionId(section.id)}
          />
        ))}
      </div>

      {/* Selected Section */}
      {selectedSectionId === "units" && (
        <ManageUnitsSection units={units ?? []} />
      )}

      {selectedSectionId === "brands" && (
        <ManageBrandsSection
          brands={brands ?? []}
          brandGroups={brandGroups ?? []}
        />
      )}

      {selectedSectionId === "specific_issues" && (
        <ManageSpecificIssuesSection specificIssues={specificIssues ?? []} />
      )}

      {selectedSectionId === "service_zones" && (
        <ManageServiceZonesSection zones={zones ?? []} />
      )}
    </div>
  );
}

export default ManageServicesSections;
