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
  DEFAULT_SECTION_ID,
  editServicesSections,
  isEditServicesSectionId,
  type EditServicesSectionId,
} from "../model/manageServices.constants";
import { useSearchParams } from "react-router";
import { useMemo, type ComponentType } from "react";

const sectionPanels = {
  units: UnitsPanel,
  brands: BrandsPanel,
  specific_issues: SpecificIssuesPanel,
  service_zones: ServiceZonesPanel,
} satisfies Record<EditServicesSectionId, ComponentType>;

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
  const issuesQuery = useSpecificIssuesQuery("all");
  const unitsQuery = useUnitsQuery("all");
  const unitsById = useMemo(
    () => new Map((unitsQuery.data ?? []).map((unit) => [unit.id, unit])),
    [unitsQuery.data],
  );
  const isPending = issuesQuery.isPending || unitsQuery.isPending;
  const error = issuesQuery.error ?? unitsQuery.error;

  if (isPending) return <SectionLoadingState />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <ManageSpecificIssuesSection
      specificIssues={issuesQuery.data ?? []}
      unitsById={unitsById}
    />
  );
}

function ServiceZonesPanel() {
  const query = useServiceZonesQuery();

  if (query.isPending) return <SectionLoadingState />;
  if (query.isError) return <ErrorMessage message={query.error.message} />;

  return <ManageServiceZonesSection zones={query.data} />;
}

function ManageServicesSections() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sectionParam = searchParams.get("section");

  const selectedSectionId = isEditServicesSectionId(sectionParam)
    ? sectionParam
    : DEFAULT_SECTION_ID;

  const handleSectionIdChange = (id: EditServicesSectionId) => {
    setSearchParams(
      (prevParams) => {
        const nextParams = new URLSearchParams(prevParams);

        nextParams.set("section", id);
        nextParams.delete("query");
        nextParams.delete("filter");

        return nextParams;
      },
      { replace: true },
    );
  };

  const ActivePanel = sectionPanels[selectedSectionId];

  return (
    <div className={formStyle}>
      <div className={editSectionListStyle}>
        {editServicesSections.map((section) => (
          <EditSectionCard
            key={section.id}
            id={section.id}
            title={section.title}
            selectedSectionId={selectedSectionId}
            onClick={() => handleSectionIdChange(section.id)}
          />
        ))}
      </div>

      <ActivePanel />
    </div>
  );
}

export default ManageServicesSections;
