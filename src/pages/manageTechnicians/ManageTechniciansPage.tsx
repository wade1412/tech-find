import { useMemo, useState } from "react";
import ManageTechnicianCard from "../../features/technician-management/ui/ManageTechnicianCard";
import { useTechniciansQuery } from "../../entities/technician/useTechniciansQuery";
import PageHeader from "../../shared/ui/PageHeader";
import { useZoneNamesByTechnicianId } from "../../entities/technician-service-zone/useZoneNamesByTechnicianId";
import ManageTechniciansSearch from "../../features/technician-management/ui/ManageTechniciansSearch";
import { filterTechniciansBySearch } from "../../features/technician-management/model/filterTechniciansBySearch";
import { AnimatePresence } from "motion/react";
import { motion } from "motion/react";
import {
  technicianCardVariants,
  technicianListVariants,
} from "../../shared/styles/motionVariants";

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

  const [openTechnicianId, setOpenTechnicianId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setOpenTechnicianId(null);
  };

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
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400">
        {error?.message}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-6">
      <section className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <PageHeader
            title="Manage Technicians"
            subtitle="Select a technician to edit the data"
          />
          <ManageTechniciansSearch
            value={searchTerm}
            onValueChange={handleSearchChange}
            className="w-full md:w-72"
          />
        </div>

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
                  whileHover={{ y: -2 }}
                >
                  <ManageTechnicianCard
                    technician={technician}
                    zones={zoneNamesByTechnicianId.get(technician.id) || []}
                    onToggle={() =>
                      setOpenTechnicianId((prev) =>
                        prev === technician.id ? null : technician.id,
                      )
                    }
                    isOpen={openTechnicianId === technician.id}
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
