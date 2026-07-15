import { useMemo, useState } from "react";
import ManageTechnicianCard from "../../features/technician-management/ui/ManageTechnicianCard";
import { useTechniciansQuery } from "../../entities/technician/useTechniciansQuery";
import PageHeader from "../../shared/ui/PageHeader";
import { useZoneNamesByTechnicianId } from "../../entities/technician-service-zone/useZoneNamesByTechnicianId";
import SearchInput from "../../shared/ui/SearchInput";
import { filterTechniciansBySearch } from "../../features/technician-management/model/filterTechniciansBySearch";
import { AnimatePresence } from "motion/react";
import { motion } from "motion/react";
import {
  technicianCardVariants,
  technicianListVariants,
} from "../../shared/styles/motionVariants";
import ErrorMessage from "../../shared/ui/ErrorMessage";
import { Link } from "react-router";

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

  const [searchTerm, setSearchTerm] = useState("");

  const visibleTechnicians = useMemo(
    () =>
      filterTechniciansBySearch(
        allTechnicians ?? [],
        searchTerm,
        zoneNamesByTechnicianId,
      ),
    [allTechnicians, searchTerm, zoneNamesByTechnicianId],
  );

  if (isPending) {
    return (
      <div className="mx-auto max-w-6xl p-4 md:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2">
              <div className="h-6 w-44 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
              <div className="h-4 w-64 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
            </div>
            <div className="h-10 w-full animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800 md:w-72" />
          </div>
          <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return <ErrorMessage message={error?.message} />;
  }

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6">
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <PageHeader
            title="Manage Technicians"
            subtitle="Select a technician to edit the data"
          />

          <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto md:items-center">
            <Link
              to="new"
              className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-600 transition-[background-color,border-color,color,opacity,transform] hover:border-main-400 hover:bg-zinc-50 hover:text-main-500 focus-visible:ring-2 focus-visible:ring-main-500 focus-visible:ring-offset-2 focus:outline-none active:scale-[0.98] dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-400 dark:hover:border-main-400 dark:hover:bg-zinc-900 dark:hover:text-main-400"
            >
              <svg
                fill="none"
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>

              <span className="text-center">Add New Technician</span>
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div
          aria-hidden="true"
          className="h-px w-full bg-zinc-200 dark:bg-zinc-800"
        />

        <SearchInput
          placeholder="Search technicians..."
          ariaLabel="Search technicians"
          className="w-full sm:w-72 self-end"
          value={searchTerm}
          onValueChange={setSearchTerm}
        />

        {/* List */}

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-2.5"
          variants={technicianListVariants}
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
                  variants={technicianCardVariants}
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
              <motion.p
                key="empty"
                layout
                variants={technicianCardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="col-span-full py-8 text-center text-sm text-zinc-400 dark:text-zinc-500"
              >
                No technicians found
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </div>
  );
}

export default ManageTechniciansPage;
