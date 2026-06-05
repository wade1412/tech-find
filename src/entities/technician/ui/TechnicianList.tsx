import { useState } from "react";
import TechnicianCard from "./TechnicianCard";
import TechnicianSkeleton from "./TechnicianSkeleton";
import { useFilteredTechnicians } from "../../../features/technician-filter/model/useFilteredTechnicians";
import { useTechnicianFilters } from "../../../features/technician-filter/model/useTechnicianFilters";
import { AnimatePresence, motion, Reorder, type Variants } from "motion/react";
import TechnicianSortSelect from "../../../features/technician-sort/ui/TechnicianSortSelect";
import { useOrderedTechnicians } from "../../../features/technician-sort/model/useOrderedTechnicians";
import { createTechnicianFilterKey } from "../../../features/technician-filter/model/filterKey";

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
  const {
    filteredTechnicians,
    technicianZonesNames,
    technicianBadges,
    isPending,
    isError,
    error,
  } = useFilteredTechnicians();

  const [openRecord, setOpenRecord] = useState<{
    filterKey: string;
    id: string;
  } | null>(null);
  const filterKey = createTechnicianFilterKey(filter);
  const orderKey = `${filterKey}|${filter.sort}`;

  const {
    currentSortTuple,
    sortedTechnicians,
    techniciansById,
    orderedIds,
    handleSortChange,
    handleReorder,
    handleDragStart,
    handleDragEnd,
    shouldIgnoreToggle,
  } = useOrderedTechnicians(
    filteredTechnicians,
    filter.sort,
    orderKey,
    updateSort,
  );

  // Open card if filterKey matches
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
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          Technicians
        </h2>
        {sortedTechnicians && sortedTechnicians.length > 0 && (
          <span className="text-xs text-zinc-400 dark:text-zinc-500">
            {sortedTechnicians.length} found
          </span>
        )}
      </div>

      <TechnicianSortSelect
        currentSortOption={currentSortTuple}
        updateSort={handleSortChange}
      />

      <AnimatePresence mode="wait">
        <Reorder.Group
          values={orderedIds}
          onReorder={handleReorder}
          key={orderKey}
          className="flex flex-col gap-2.5"
          variants={listVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {orderedIds.length > 0 ? (
            orderedIds.map((id) => {
              const technician = techniciansById.get(id);
              if (!technician) return null;

              return (
                <Reorder.Item
                  key={technician.id}
                  value={technician.id}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  variants={cardVariants}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.15 }}
                  className="relative"
                >
                  <TechnicianCard
                    technician={technician}
                    zones={technicianZonesNames.get(technician.id) || []}
                    skillBadges={technicianBadges.get(technician.id) || []}
                    isOpen={openTechnicianId === technician.id}
                    onToggle={() => {
                      if (shouldIgnoreToggle()) return;
                      setOpenRecord((prev) =>
                        prev?.filterKey === filterKey &&
                        prev.id === technician.id
                          ? null
                          : { filterKey, id: technician.id },
                      );
                    }}
                  />
                </Reorder.Item>
              );
            })
          ) : (
            <motion.p
              variants={cardVariants}
              className="py-8 text-center text-sm text-zinc-400 dark:text-zinc-500"
            >
              No technicians found
            </motion.p>
          )}
        </Reorder.Group>
      </AnimatePresence>
    </div>
  );
}

export default TechnicianList;
