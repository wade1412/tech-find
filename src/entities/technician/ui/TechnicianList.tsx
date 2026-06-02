import { useState } from "react";
import TechnicianCard from "./TechnicianCard";
import TechnicianSkeleton from "./TechnicianSkeleton";
import { useFilteredTechnicians } from "../../../features/technician-filter/model/useFilteredTechnicians";
import { useTechnicianFilters } from "../../../features/technician-filter/model/useTechnicianFilters";
import { AnimatePresence, motion, type Variants } from "motion/react";
import TechnicianSortSelect from "../../../features/technician-sort/model/ui/TechnicianSortSelect";
import type { SortTuple } from "../../../features/technician-sort/model/technicianSort.types";
import { useTechnicianSort } from "../../../features/technician-sort/model/useTechnicianSort";

const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.12, ease: "easeIn" },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

function TechnicianList() {
  const { filter, updateSort } = useTechnicianFilters();
  const { filteredTechnicians, technicianBadges, isPending, isError, error } =
    useFilteredTechnicians();

  const sortedTechnicians = useTechnicianSort(
    filteredTechnicians,
    filter.sort.split(".") as SortTuple,
  );

  const filterKey = JSON.stringify(filter);

  const [openRecord, setOpenRecord] = useState<{
    filterKey: string;
    id: string;
  } | null>(null);

  // open card if filterKey matches
  const openTechnicianId =
    openRecord?.filterKey === filterKey ? openRecord.id : null;

  if (isPending) return <TechnicianSkeleton />;

  if (isError)
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400">
        {error?.message}
      </div>
    );

  return (
    <div>
      <h2 className="font-heading text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2.5">
        Technicians
      </h2>
      <TechnicianSortSelect
        currentSortOption={filter.sort.split(".") as SortTuple}
        updateSort={updateSort}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={filterKey}
          className="flex flex-col gap-2.5"
          variants={listVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {sortedTechnicians && sortedTechnicians.length > 0 ? (
            sortedTechnicians.map((technician) => (
              <motion.div
                key={technician.id}
                variants={cardVariants}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
              >
                <TechnicianCard
                  technician={technician}
                  skillBadges={technicianBadges.get(technician.id) || []}
                  isOpen={openTechnicianId === technician.id}
                  onToggle={() =>
                    setOpenRecord((prev) =>
                      prev?.filterKey === filterKey && prev.id === technician.id
                        ? null
                        : { filterKey, id: technician.id },
                    )
                  }
                />
              </motion.div>
            ))
          ) : (
            <motion.p
              variants={cardVariants}
              className="py-8 text-center text-sm text-zinc-400 dark:text-zinc-500"
            >
              No technicians found
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default TechnicianList;
