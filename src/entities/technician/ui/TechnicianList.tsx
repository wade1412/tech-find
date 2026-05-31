import { useState } from "react";
import TechnicianCard from "./TechnicianCard";
import TechnicianSkeleton from "./TechnicianSkeleton";
import { useFilteredTechnicians } from "../../../features/technician-filter/model/useFilteredTechnicians";
import { useTechnicianFilters } from "../../../features/technician-filter/model/useTechnicianFilters";
import { AnimatePresence, motion, type Variants } from "motion/react";

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
  const { filteredTechnicians, technicianBadges, isPending, isError, error } =
    useFilteredTechnicians();
  const { filter } = useTechnicianFilters();

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
    <AnimatePresence mode="wait">
      <motion.div
        key={filterKey}
        className="flex flex-col gap-2.5"
        variants={listVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {filteredTechnicians && filteredTechnicians.length > 0 ? (
          filteredTechnicians.map((technician) => (
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
  );
}

export default TechnicianList;
