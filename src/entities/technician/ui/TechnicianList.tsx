import { useEffect, useRef, useState } from "react";
import TechnicianCard from "./TechnicianCard";
import TechnicianSkeleton from "./TechnicianSkeleton";
import { useFilteredTechnicians } from "../../../features/technician-filter/model/useFilteredTechnicians";
import { useTechnicianFilters } from "../../../features/technician-filter/model/useTechnicianFilters";
import { AnimatePresence, motion, Reorder, type Variants } from "motion/react";
import TechnicianSortSelect from "../../../features/technician-sort/ui/TechnicianSortSelect";
import { useTechnicianSort } from "../../../features/technician-sort/model/useTechnicianSort";
import { parseStringToSortTuple } from "../../../features/technician-sort/model/sortHelpers";

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
  const [openRecord, setOpenRecord] = useState<{
    filterKey: string;
    id: string;
  } | null>(null);
  const [customOrderIds, setCustomOrderIds] = useState<string[]>([]);
  const isDragging = useRef(false);

  const filterKey = JSON.stringify(filter);
  const currentSortTuple = parseStringToSortTuple(filter.sort);
  const sortedTechnicians = useTechnicianSort(
    filteredTechnicians,
    currentSortTuple,
  );
  // Open card if filterKey matches
  const openTechnicianId =
    openRecord?.filterKey === filterKey ? openRecord.id : null;

  const orderedTechncians =
    customOrderIds.length > 0
      ? [...sortedTechnicians].sort(
          (a, b) => customOrderIds.indexOf(a.id) - customOrderIds.indexOf(b.id),
        )
      : sortedTechnicians;

  useEffect(() => {
    if (isDragging.current) {
      isDragging.current = false;
      return;
    }

    setCustomOrderIds([]);
  }, [filter.sort]);

  // Conditional Renders
  if (isPending) return <TechnicianSkeleton />;

  if (isError)
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400">
        {error?.message}
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
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
        updateSort={updateSort}
      />

      <AnimatePresence mode="wait">
        <Reorder.Group
          values={orderedTechncians}
          onReorder={(newOrder) => {
            isDragging.current = true;
            setCustomOrderIds(newOrder.map((el) => el.id));
          }}
          key={filterKey}
          className="flex flex-col gap-2.5"
          variants={listVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {orderedTechncians && orderedTechncians.length > 0 ? (
            orderedTechncians.map((technician) => (
              <Reorder.Item key={technician.id} value={technician}>
                <motion.div
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
                        prev?.filterKey === filterKey &&
                        prev.id === technician.id
                          ? null
                          : { filterKey, id: technician.id },
                      )
                    }
                  />
                </motion.div>
              </Reorder.Item>
            ))
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
