import { useMemo, useRef, useState } from "react";
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

  const { sort, ...filterWithoutSort } = filter;
  const filterKey = JSON.stringify(filterWithoutSort);
  const orderKey = `${filterKey}|${sort}`;

  const [customOrder, setCustomOrder] = useState<{
    key: string;
    ids: string[];
  }>({ key: "", ids: [] });

  const handleSortChange = (newSort: string) => {
    setCustomOrder({ key: "", ids: [] });
    updateSort(newSort);
  };

  const isDragging = useRef(false);

  const currentSortTuple = parseStringToSortTuple(filter.sort);
  const sortedTechnicians = useTechnicianSort(
    filteredTechnicians,
    currentSortTuple,
  );
  // Open card if filterKey matches
  const openTechnicianId =
    openRecord?.filterKey === filterKey ? openRecord.id : null;

  const techById = useMemo(
    () => new Map(sortedTechnicians.map((t) => [t.id, t])),
    [sortedTechnicians],
  );

  const orderedIds = useMemo(() => {
    const sortedIds = Array.from(techById.keys());

    const hasCustomOrder =
      customOrder.key === orderKey && customOrder.ids.length > 0;

    if (!hasCustomOrder) {
      return sortedIds;
    }

    const customOrderSet = new Set(customOrder.ids);

    return [
      ...customOrder.ids.filter((id) => techById.has(id)),
      ...sortedIds.filter((id) => !customOrderSet.has(id)),
    ];
  }, [customOrder, orderKey, techById]);

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
        updateSort={handleSortChange}
      />

      <AnimatePresence mode="wait">
        <Reorder.Group
          values={orderedIds}
          onReorder={(newOrder) => {
            if (!isDragging.current) return;
            setCustomOrder({ key: orderKey, ids: newOrder });
          }}
          key={orderKey}
          className="flex flex-col gap-2.5"
          variants={listVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {orderedIds.length > 0 ? (
            orderedIds.map((id) => {
              const technician = techById.get(id);
              if (!technician) return null;

              return (
                <Reorder.Item
                  key={technician.id}
                  value={technician.id}
                  onDragStart={() => {
                    isDragging.current = true;
                  }}
                  onDragEnd={() =>
                    window.setTimeout(() => {
                      isDragging.current = false;
                    }, 0)
                  }
                  className="relative"
                >
                  <motion.div
                    variants={cardVariants}
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.15 }}
                  >
                    <TechnicianCard
                      technician={technician}
                      skillBadges={technicianBadges.get(technician.id) || []}
                      isOpen={openTechnicianId === technician.id}
                      onToggle={() => {
                        if (isDragging.current) return;
                        setOpenRecord((prev) =>
                          prev?.filterKey === filterKey &&
                          prev.id === technician.id
                            ? null
                            : { filterKey, id: technician.id },
                        );
                      }}
                    />
                  </motion.div>
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
