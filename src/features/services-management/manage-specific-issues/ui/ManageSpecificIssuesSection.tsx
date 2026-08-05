import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSearchParams } from "react-router";
import type { SpecificIssue } from "../../../../entities/specific-issue/specific-issue.types";
import type { Unit } from "../../../../entities/unit/unit.types";
import {
  managementListItemVariants,
  managementListVariants,
} from "../../../../shared/styles/motionVariants";
import {
  buttonContainerStyle,
  formWithPaddingStyle,
  ghostButton,
  manageListGridStyle,
  noEditValuesStyle,
  pageTitleWithButtonsContainerStyle,
  searchRowStyle,
  sectionHeaderSubtextStyle,
} from "../../../../shared/styles/styles";
import CreateNewEntityLinkButton from "../../../../shared/ui/CreateNewEntityLinkButton";
import HorizontalDivider from "../../../../shared/ui/HorizontalDivider";
import SearchInput from "../../../../shared/ui/SearchInput";
import SectionHeader from "../../../../shared/ui/SectionHeader";
import SegmentedControl from "../../../../shared/ui/SegmentedControl";
import {
  isServiceStatusFilterValue,
  SERVICE_STATUS_FILTER_OPTIONS,
  type ServiceStatusFilterValue,
} from "../../model/servicesListFilters.constants";
import { filterSpecificIssues } from "../model/filterSpecificIssues";
import ManageSpecificIssueCard from "./ManageSpecificIssueCard";
import OpenArchivedSpecificIssuesDialogButton from "./OpenArchivedSpecificIssuesDialogButton";

interface ManageSpecificIssuesSectionProps {
  specificIssues: SpecificIssue[];
  unitsById: ReadonlyMap<string, Unit>;
}

const formatIssueCount = (count: number) =>
  `${count} ${count === 1 ? "issue" : "issues"}`;

function ManageSpecificIssuesSection({
  specificIssues,
  unitsById,
}: ManageSpecificIssuesSectionProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("query") ?? "";
  const filterParam = searchParams.get("filter");
  const statusFilter = isServiceStatusFilterValue(filterParam)
    ? filterParam
    : "all";
  const visibleIssues = useMemo(
    () =>
      filterSpecificIssues({
        searchTerm,
        specificIssues,
        status: statusFilter,
        unitsById,
      }),
    [searchTerm, specificIssues, statusFilter, unitsById],
  );
  const hasAppliedFilters =
    Boolean(searchTerm.trim()) || statusFilter !== "all";
  const resultCountLabel = hasAppliedFilters
    ? `${visibleIssues.length} of ${formatIssueCount(specificIssues.length)}`
    : formatIssueCount(specificIssues.length);

  const updateSearchParam = (key: string, value?: string) => {
    setSearchParams(
      (previousParams) => {
        const nextParams = new URLSearchParams(previousParams);

        if (value) nextParams.set(key, value);
        else nextParams.delete(key);

        return nextParams;
      },
      { replace: true },
    );
  };

  const clearFilters = () => {
    setSearchParams(
      (previousParams) => {
        const nextParams = new URLSearchParams(previousParams);
        nextParams.delete("query");
        nextParams.delete("filter");
        return nextParams;
      },
      { replace: true },
    );
  };

  return (
    <div className={formWithPaddingStyle}>
      <div className={pageTitleWithButtonsContainerStyle}>
        <SectionHeader
          label="Manage Specific Issues"
          subtext="Configure unit-specific issues used by technician skills and ignore lists"
        />

        <div className={buttonContainerStyle}>
          <OpenArchivedSpecificIssuesDialogButton unitsById={unitsById} />
          <CreateNewEntityLinkButton
            linkTo="specific-issues/new"
            label="Create Specific Issue"
          />
        </div>
      </div>

      <HorizontalDivider />

      <div className={formWithPaddingStyle}>
        <div className={searchRowStyle}>
          <div className="w-full sm:w-auto sm:min-w-75">
            <SegmentedControl
              ariaLabel="Filter specific issues by status"
              options={SERVICE_STATUS_FILTER_OPTIONS}
              onChange={(value: ServiceStatusFilterValue) =>
                updateSearchParam(
                  "filter",
                  value === "all" ? undefined : value,
                )
              }
              value={statusFilter}
            />
          </div>

          <SearchInput
            placeholder="Search by issue, slug, or unit..."
            ariaLabel="Search specific issues"
            className="w-full sm:w-80"
            value={searchTerm}
            onValueChange={(value) => updateSearchParam("query", value)}
          />
        </div>

        <div>
          <p
            aria-live="polite"
            className={`${sectionHeaderSubtextStyle} mb-2.5`}
          >
            {resultCountLabel}
          </p>

          <motion.div
            className={manageListGridStyle}
            variants={managementListVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="popLayout">
              {visibleIssues.length > 0 ? (
                visibleIssues.map((specificIssue) => (
                  <motion.div
                    key={specificIssue.id}
                    layout
                    variants={managementListItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    whileTap={{ scale: 0.98 }}
                  >
                    <ManageSpecificIssueCard
                      specificIssue={specificIssue}
                      unit={unitsById.get(specificIssue.unit_id)}
                    />
                  </motion.div>
                ))
              ) : (
                <motion.div
                  key="empty"
                  layout
                  variants={managementListItemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={`${noEditValuesStyle} col-span-full flex flex-col items-center gap-2`}
                >
                  <p>
                    {hasAppliedFilters
                      ? "No specific issues match the current filters."
                      : "No specific issues have been created yet."}
                  </p>
                  {hasAppliedFilters && (
                    <button
                      type="button"
                      className={ghostButton}
                      onClick={clearFilters}
                    >
                      Clear filters
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default ManageSpecificIssuesSection;
