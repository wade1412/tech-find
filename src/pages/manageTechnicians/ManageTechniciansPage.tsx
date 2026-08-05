import { useMemo } from "react";
import ManageTechnicianCard from "../../features/technician-management/ui/ManageTechnicianCard";
import { useTechniciansQuery } from "../../entities/technician/useTechniciansQuery";
import PageHeader from "../../shared/ui/PageHeader";
import { useZoneNamesByTechnicianId } from "../../entities/technician-service-zone/useZoneNamesByTechnicianId";
import SearchInput from "../../shared/ui/SearchInput";
import { filterManageTechnicians } from "../../features/technician-management/model/filterManageTechnicians";
import { AnimatePresence } from "motion/react";
import { motion } from "motion/react";
import {
  managementListItemVariants,
  managementListVariants,
} from "../../shared/styles/motionVariants";
import ErrorMessage from "../../shared/ui/ErrorMessage";
import { useSearchParams } from "react-router";
import {
  buttonContainerStyle,
  centeredContainerStyle,
  formStyle,
  ghostButton,
  manageListGridStyle,
  noEditValuesStyle,
  pageTitleWithButtonsContainerStyle,
  searchRowStyle,
  sectionHeaderSubtextStyle,
} from "../../shared/styles/styles";
import SegmentedControl from "../../shared/ui/SegmentedControl";
import {
  isManageTechniciansListFilterValue,
  MANAGE_TECHNICIANS_LIST_FILTER_OPTIONS,
  type ManageTechniciansListFilterValue,
} from "../../features/technician-management/model/manageTechnicians.constants";
import OpenArchivedTechniciansDialogButton from "../../features/technician-management/archive-technician/ui/OpenArchivedTechniciansDialogButton";
import ManagementListSkeleton from "../../shared/ui/ManagementListSkeleton";
import HorizontalDivider from "../../shared/ui/HorizontalDivider";
import CreateNewEntityLinkButton from "../../shared/ui/CreateNewEntityLinkButton";

function ManageTechniciansPage() {
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

  const [searchParams, setSearchParams] = useSearchParams();

  const searchTerm = searchParams.get("query") || "";
  const filterParam = searchParams.get("filter");
  const statusFilter = isManageTechniciansListFilterValue(filterParam)
    ? filterParam
    : "all";

  const handleInputChange = (value: string) => {
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

  const handleStatusFilterChange = (
    value: ManageTechniciansListFilterValue,
  ) => {
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

  const visibleTechnicians = useMemo(
    () =>
      filterManageTechnicians({
        technicians: allTechnicians ?? [],
        searchTerm,
        status: statusFilter,
        zoneNamesByTechnicianId,
      }),
    [allTechnicians, searchTerm, statusFilter, zoneNamesByTechnicianId],
  );

  const hasAppliedFilters =
    Boolean(searchTerm.trim()) || statusFilter !== "all";
  const technicianCount = allTechnicians?.length ?? 0;

  if (isPending) {
    return <ManagementListSkeleton />;
  }

  if (isError) {
    return (
      <div className={centeredContainerStyle}>
        <ErrorMessage message={error?.message} />
      </div>
    );
  }

  return (
    <div className={centeredContainerStyle}>
      <section className={formStyle}>
        <div className={pageTitleWithButtonsContainerStyle}>
          <PageHeader
            title="Manage Technicians"
            subtitle="Select a technician to edit the data"
          />

          <div className={buttonContainerStyle}>
            <OpenArchivedTechniciansDialogButton />
            <CreateNewEntityLinkButton linkTo="new" label="Create Technician" />
          </div>
        </div>

        <HorizontalDivider />

        {/* List Filter and Search */}
        <div className={`${formStyle} px-2`}>
          <div className={searchRowStyle}>
            <div className="w-full sm:w-auto sm:min-w-75">
              <SegmentedControl
                ariaLabel="Select technicians filter"
                options={MANAGE_TECHNICIANS_LIST_FILTER_OPTIONS}
                onChange={handleStatusFilterChange}
                value={statusFilter}
              />
            </div>

            <SearchInput
              placeholder="Search by name, ZIP, or zone..."
              ariaLabel="Search technicians"
              className="w-full sm:w-72"
              value={searchTerm}
              onValueChange={handleInputChange}
            />
          </div>

          {/* List */}
          <div>
            <div
              aria-live="polite"
              className={`${sectionHeaderSubtextStyle} mb-2.5`}
            >
              {hasAppliedFilters
                ? `${visibleTechnicians.length} of ${technicianCount} technicians`
                : `${technicianCount} technicians`}
            </div>
            <motion.div
              className={manageListGridStyle}
              variants={managementListVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <AnimatePresence mode="popLayout">
                {visibleTechnicians.length > 0 ? (
                  visibleTechnicians.map((technician) => (
                    <motion.div
                      key={technician.id}
                      layout
                      variants={managementListItemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      whileTap={{ scale: 0.95 }}
                    >
                      <ManageTechnicianCard
                        technician={technician}
                        zones={zoneNamesByTechnicianId.get(technician.id) || []}
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
                    <p>No technicians match the current filters.</p>
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
      </section>
    </div>
  );
}

export default ManageTechniciansPage;
