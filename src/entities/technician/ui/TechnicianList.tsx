import { useCallback, useEffect, useRef, useState } from "react";
import TechnicianCard from "./TechnicianCard";
import TechnicianSkeleton from "./TechnicianSkeleton";
import { useFilteredTechnicians } from "../../../features/technician-filter/model/useFilteredTechnicians";
import { useTechnicianFilters } from "../../../features/technician-filter/model/useTechnicianFilters";
import { AnimatePresence, motion, Reorder } from "motion/react";
import TechnicianSortSelect from "../../../features/technician-sort/ui/TechnicianSortSelect";
import { useOrderedTechnicians } from "../../../features/technician-sort/model/useOrderedTechnicians";
import { createTechnicianFilterKey } from "../../../features/technician-filter/model/filterKey";
import {
  technicianCardVariants,
  technicianListVariants,
} from "../../../shared/styles/motionVariants";
import ErrorMessage from "../../../shared/ui/ErrorMessage";

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
  const listRef = useRef<HTMLUListElement | null>(null);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const previousFilterKeyRef = useRef<string | null>(null);
  const filterKey = createTechnicianFilterKey(filter);
  const orderKey = `${filterKey}|${filter.sort}`;

  // Scroll to top on filter change only
  useEffect(() => {
    if (previousFilterKeyRef.current === null) {
      previousFilterKeyRef.current = filterKey;
      return;
    }

    if (previousFilterKeyRef.current === filterKey) return;

    previousFilterKeyRef.current = filterKey;
    listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [filterKey]);

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

  const updateScrollFade = useCallback(() => {
    const list = listRef.current;
    if (!list) return;

    const remainingScroll =
      list.scrollHeight - list.scrollTop - list.clientHeight;
    setCanScrollDown(remainingScroll > 2);
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const frameId = requestAnimationFrame(updateScrollFade);
    const observer = new ResizeObserver(updateScrollFade);

    observer.observe(list);
    Array.from(list.children).forEach((child) => observer.observe(child));

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, [openTechnicianId, orderedIds, updateScrollFade]);

  if (isPending) return <TechnicianSkeleton />;

  if (isError) return <ErrorMessage message={error?.message} />;

  return (
    <div className="relative flex h-full min-h-0 flex-col gap-2.5 overflow-hidden">
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

      <Reorder.Group
        ref={listRef}
        layout
        values={orderedIds}
        onReorder={handleReorder}
        onScroll={updateScrollFade}
        className="technician-scroll flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto overscroll-contain px-1 pb-8"
        variants={technicianListVariants}
        initial="hidden"
        animate="visible"
        transition={{ layout: { duration: 0.24, ease: "easeOut" } }}
      >
        <AnimatePresence initial={false}>
          {orderedIds.length > 0 ? (
            orderedIds.map((id) => {
              const technician = techniciansById.get(id);
              if (!technician) return null;

              return (
                <Reorder.Item
                  key={technician.id}
                  layout="position"
                  value={technician.id}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                  variants={technicianCardVariants}
                  transition={{
                    opacity: { duration: 0.2, ease: "easeOut" },
                    layout: { duration: 0.24, ease: "easeOut" },
                  }}
                  className="relative shrink-0"
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
              variants={technicianCardVariants}
              className="py-8 text-center text-sm text-zinc-400 dark:text-zinc-500"
            >
              No technicians found
            </motion.p>
          )}
        </AnimatePresence>
      </Reorder.Group>

      <div
        aria-hidden="true"
        className={`pointer-events-none absolute right-3 bottom-0 left-1 h-6 bg-linear-to-t from-zinc-50 via-zinc-50/85 to-transparent backdrop-blur-[1px] transition-opacity duration-200 dark:from-zinc-950 dark:via-zinc-950/85 ${
          canScrollDown ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

export default TechnicianList;
