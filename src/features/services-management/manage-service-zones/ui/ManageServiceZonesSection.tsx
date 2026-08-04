import { useSearchParams } from "react-router";
import type { ServiceZone } from "../../../../entities/service-zone/service-zone.types";
import {
  isServiceStatusFilterValue,
  SERVICE_STATUS_FILTER_OPTIONS,
  type ServiceStatusFilterValue,
} from "../../model/servicesListFilters.constants";
import { useMemo } from "react";
import { filterServiceZones } from "../model/manage-zones.helpers";
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
import SectionHeader from "../../../../shared/ui/SectionHeader";
import CreateNewEntityLinkButton from "../../../../shared/ui/CreateNewEntityLinkButton";
import HorizontalDivider from "../../../../shared/ui/HorizontalDivider";
import SegmentedControl from "../../../../shared/ui/SegmentedControl";
import SearchInput from "../../../../shared/ui/SearchInput";
import { AnimatePresence, motion } from "motion/react";
import {
  managementListItemVariants,
  managementListVariants,
} from "../../../../shared/styles/motionVariants";
import ManageZoneCard from "./ManageZoneCard";

interface ManageServiceZonesSectionProps {
  zones: ServiceZone[];
}

const formatZoneCount = (count: number) =>
  `${count} ${count === 1 ? "zone" : "zones"}`;

function ManageServiceZonesSection({ zones }: ManageServiceZonesSectionProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("query") ?? "";
  const filterParam = searchParams.get("filter");
  const statusFilter = isServiceStatusFilterValue(filterParam)
    ? filterParam
    : "all";

  const handleSearchChange = (value: string) => {
    setSearchParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev);

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

  const handleStatusFilterChange = (value: ServiceStatusFilterValue) => {
    setSearchParams(
      (prev) => {
        const nextParams = new URLSearchParams(prev);

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
      (prev) => {
        const nextParams = new URLSearchParams(prev);
        nextParams.delete("query");
        nextParams.delete("filter");
        return nextParams;
      },
      { replace: true },
    );
  };

  const visibleZones = useMemo(
    () =>
      filterServiceZones({
        serviceZones: zones,
        searchTerm,
        status: statusFilter,
      }),
    [zones, searchTerm, statusFilter],
  );

  const hasAppliedFilters =
    Boolean(searchTerm.trim()) || statusFilter !== "all";
  const resultCountLabel = hasAppliedFilters
    ? `${visibleZones.length} of ${formatZoneCount(zones.length)}`
    : formatZoneCount(zones.length);

  return (
    <div className={formWithPaddingStyle}>
      <div className={pageTitleWithButtonsContainerStyle}>
        <SectionHeader
          label="Manage Service Zones"
          subtext="Edit service zones"
        />

        <div className={buttonContainerStyle}>
          <button>Open Archive</button>
          <CreateNewEntityLinkButton linkTo="zones/new" label="Create Zone" />
        </div>
      </div>

      <HorizontalDivider />

      <div className={formWithPaddingStyle}>
        <div className={searchRowStyle}>
          <div className="w-full sm:w-auto sm:min-w-75">
            <SegmentedControl
              ariaLabel="Filter zones by status"
              options={SERVICE_STATUS_FILTER_OPTIONS}
              onChange={handleStatusFilterChange}
              value={statusFilter}
            />
          </div>

          <SearchInput
            placeholder="Search by name, slug or order..."
            ariaLabel="Search zones"
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
              {visibleZones.length > 0 ? (
                visibleZones.map((zone) => (
                  <motion.div
                    key={zone.id}
                    layout
                    variants={managementListItemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    whileTap={{ scale: 0.98 }}
                  >
                    <ManageZoneCard zone={zone} />
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
                      ? "No zones match the current filters."
                      : "No zones have been created yet."}
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

export default ManageServiceZonesSection;
