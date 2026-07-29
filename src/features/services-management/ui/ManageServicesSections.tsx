import { useState } from "react";
import { useBrandGroupsQuery } from "../../../entities/brandGroup/useBrandGroupsQuery";
import { useBrandsQuery } from "../../../entities/brand/useBrandsQuery";
import { useServiceZonesQuery } from "../../../entities/service-zone/useServiceZonesQuery";
import { useSpecificIssuesQuery } from "../../../entities/specific-issue/useSpecificIssuesQuery";
import { useUnitsQuery } from "../../../entities/unit/useUnitsQuery";
import { editSectionListStyle, formStyle } from "../../../shared/styles/styles";
import EditSectionCard from "../../../shared/ui/EditSectionCard";
import ErrorMessage from "../../../shared/ui/ErrorMessage";
import ManageBrandsSection from "../manage-brands/ui/ManageBrandsSection";
import ManageServiceZonesSection from "../manage-service-zones/ui/ManageServiceZonesSection";
import ManageSpecificIssuesSection from "../manage-specific-issues/ui/ManageSpecificIssuesSection";
import ManageUnitsSection from "../manage-units/ui/ManageUnitsSection";
import {
  editServicesSections,
  type EditServicesSectionId,
} from "../model/manageServices.constants";

function SectionLoadingState() {
  return (
    <div
      role="status"
      aria-label="Loading service section"
      className="grid grid-cols-1 gap-2.5 md:grid-cols-3"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="h-20 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800"
        />
      ))}
    </div>
  );
}

function UnitsPanel() {
  const query = useUnitsQuery("all");

  if (query.isPending) return <SectionLoadingState />;
  if (query.isError) return <ErrorMessage message={query.error.message} />;

  return <ManageUnitsSection units={query.data} />;
}

function BrandsPanel() {
  const brandsQuery = useBrandsQuery("all");
  const groupsQuery = useBrandGroupsQuery("all");
  const isPending = brandsQuery.isPending || groupsQuery.isPending;
  const error = brandsQuery.error ?? groupsQuery.error;

  if (isPending) return <SectionLoadingState />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <ManageBrandsSection
      brands={brandsQuery.data ?? []}
      brandGroups={groupsQuery.data ?? []}
    />
  );
}

function SpecificIssuesPanel() {
  const query = useSpecificIssuesQuery();

  if (query.isPending) return <SectionLoadingState />;
  if (query.isError) return <ErrorMessage message={query.error.message} />;

  return <ManageSpecificIssuesSection specificIssues={query.data} />;
}

function ServiceZonesPanel() {
  const query = useServiceZonesQuery();

  if (query.isPending) return <SectionLoadingState />;
  if (query.isError) return <ErrorMessage message={query.error.message} />;

  return <ManageServiceZonesSection zones={query.data} />;
}

function ManageServicesSections() {
  const [selectedSectionId, setSelectedSectionId] =
    useState<EditServicesSectionId>("units");

  return (
    <div className={formStyle}>
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

      {selectedSectionId === "units" && <UnitsPanel />}
      {selectedSectionId === "brands" && <BrandsPanel />}
      {selectedSectionId === "specific_issues" && <SpecificIssuesPanel />}
      {selectedSectionId === "service_zones" && <ServiceZonesPanel />}
    </div>
  );
}

export default ManageServicesSections;
