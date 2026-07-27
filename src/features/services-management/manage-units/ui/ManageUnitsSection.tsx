import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useSearchParams } from "react-router";
import type { Unit } from "../../../../entities/unit/unit.types";
import {
  managementListItemVariants,
  managementListVariants,
} from "../../../../shared/styles/motionVariants";
import {
  buttonContainerStyle,
  formStyle,
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
import { filterUnits } from "../model/filterUnits";
import {
  isUnitStatusFilterValue,
  UNIT_STATUS_FILTER_OPTIONS,
  type UnitStatusFilterValue,
} from "../model/unitListFilters.constants";
import ManageUnitCard from "./ManageUnitCard";

interface ManageUnitsSectionProps {
  units: Unit[];
}

const formatUnitCount = (count: number) =>
  `${count} ${count === 1 ? "unit" : "units"}`;

function ManageUnitsSection({ units }: ManageUnitsSectionProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("query") ?? "";
  const filterParam = searchParams.get("filter");
  const statusFilter = isUnitStatusFilterValue(filterParam)
    ? filterParam
    : "all";
  const visibleUnits = useMemo(
    () =>
      filterUnits({
        units,
        searchTerm,
        status: statusFilter,
      }),
    [searchTerm, statusFilter, units],
  );
  const hasAppliedFilters =
    Boolean(searchTerm.trim()) || statusFilter !== "all";
  const resultCountLabel = hasAppliedFilters
    ? `${visibleUnits.length} of ${formatUnitCount(units.length)}`
    : formatUnitCount(units.length);

  const handleSearchChange = (value: string) => {
    setSearchParams(
      (previousParams) => {
        const nextParams = new URLSearchParams(previousParams);

        if (value) {
          nextParams.set("query", value);
        } else {
          nextParams.delete("query");
        }

        return nextParams;
      },
      { replace: true },
    );
  };

  const handleStatusFilterChange = (value: UnitStatusFilterValue) => {
    setSearchParams(
      (previousParams) => {
        const nextParams = new URLSearchParams(previousParams);

        if (value === "all") {
          nextParams.delete("filter");
        } else {
          nextParams.set("filter", value);
        }

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
          label="Manage Units"
          subtext="Edit units and their Home filter order"
        />

        <div className={buttonContainerStyle}>
          <CreateNewEntityLinkButton linkTo="units/new" label="Create Unit" />
        </div>
      </div>

      <HorizontalDivider />

      <div className={formStyle}>
        <div className={searchRowStyle}>
          <div className="w-full sm:w-auto sm:min-w-75">
            <SegmentedControl
              ariaLabel="Filter units by status"
              options={UNIT_STATUS_FILTER_OPTIONS}
              onChange={handleStatusFilterChange}
              value={statusFilter}
            />
          </div>

          <SearchInput
            placeholder="Search by name, slug, order, or capability..."
            ariaLabel="Search units"
            className="w-full sm:w-80"
            value={searchTerm}
            onValueChange={handleSearchChange}
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
              {visibleUnits.length > 0 ? (
                visibleUnits.map((unit) => (
                  <motion.div
                    key={unit.id}
                    layout
                    variants={managementListItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    whileTap={{ scale: 0.98 }}
                  >
                    <ManageUnitCard unit={unit} />
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
                      ? "No units match the current filters."
                      : "No units have been created yet."}
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

export default ManageUnitsSection;
