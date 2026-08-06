import { useBrandGroupsQuery } from "../../../entities/brandGroup/useBrandGroupsQuery";
import { useBrandsQuery } from "../../../entities/brand/useBrandsQuery";
import { useServiceZonesQuery } from "../../../entities/service-zone/useServiceZonesQuery";
import { useSpecificIssuesQuery } from "../../../entities/specific-issue/useSpecificIssuesQuery";
import { useUnitsQuery } from "../../../entities/unit/useUnitsQuery";
import {
  editSectionListStyle,
  formStyle,
  formWithPaddingStyle,
  manageListGridStyle,
} from "../../../shared/styles/styles";
import EditSectionCard from "../../../shared/ui/EditSectionCard";
import ErrorMessage from "../../../shared/ui/ErrorMessage";
import HorizontalDivider from "../../../shared/ui/HorizontalDivider";
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
      aria-busy="true"
      className={formWithPaddingStyle}
    >
      <div aria-hidden="true" className={formStyle}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="h-4 w-44 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-3 w-80 max-w-[75vw] animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
          </div>

          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <div className="h-10 w-full animate-pulse rounded-xl bg-zinc-200 sm:w-40 dark:bg-zinc-800" />
            <div className="h-10 w-full animate-pulse rounded-xl bg-zinc-200 sm:w-40 dark:bg-zinc-800" />
          </div>
        </div>

        <HorizontalDivider />

        <div className={formWithPaddingStyle}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="h-10 w-full animate-pulse rounded-xl bg-zinc-200 sm:w-75 dark:bg-zinc-800" />
            <div className="h-10 w-full animate-pulse rounded-xl bg-zinc-200 sm:w-80 dark:bg-zinc-800" />
          </div>

          <div className="h-3 w-16 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />

          <div className={manageListGridStyle}>
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="flex min-h-24 items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/60"
              >
                <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-zinc-200 dark:bg-zinc-800" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-4 w-36 max-w-full animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
                  <div className="h-3 w-24 max-w-full animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
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
  const query = useServiceZonesQuery("all");

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
