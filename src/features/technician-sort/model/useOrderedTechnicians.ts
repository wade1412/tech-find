//Read sortMode from URL and pass it to sortTechncians and returned sorted array

import { useMemo, useRef, useState } from "react";
import { sortTechnicians } from "./sortTechnicians";
import { parseStringToSortTuple } from "./sortHelpers";
import type { Technician } from "../../../entities/technician/technician.types";

export const useTechnicianSort = (
  technicians: Technician[],
  sort: string,
  orderKey: string,
  updateSort: (newSort: string) => void,
) => {
  const [customOrder, setCustomOrder] = useState<{
    key: string;
    ids: string[];
  }>({ key: "", ids: [] });
  const isDragging = useRef(false);

  const currentSortTuple = parseStringToSortTuple(sort);
  const [value, direction] = currentSortTuple;

  const sortedTechnicians = useMemo(() => {
    if (!technicians || !value || !direction) return technicians;

    return sortTechnicians(technicians, {
      sortMode: value,
      sortDirection: direction,
    });
  }, [technicians, value, direction]);

  const sortedTechsById = useMemo(
    () => new Map(sortedTechnicians.map((t) => [t.id, t])),
    [sortedTechnicians],
  );

  const orderedIds = useMemo(() => {
    const { key, ids } = customOrder;
    const sortedIds = Array.from(sortedTechsById.keys());

    const hasCustomOrder = key === orderKey && ids.length > 0;

    if (!hasCustomOrder) {
      return sortedIds;
    }

    const customOrderSet = new Set(customOrder.ids);

    return [
      // Return only relevant ids
      ...customOrder.ids.filter((id) => sortedTechsById.has(id)),
      ...sortedIds.filter((id) => !customOrderSet.has(id)),
    ];
  }, [customOrder, orderKey, sortedTechsById]);

  const handleSortChange = (newSort: string) => {
    setCustomOrder({ key: "", ids: [] });
    updateSort(newSort);
  };

  const handleReorder = (newOrder: string[]) => {
    if (!isDragging.current) return;
    setCustomOrder({ key: orderKey, ids: newOrder });
  };

  const handleDragStart = () => {
    isDragging.current = true;
  };

  const handleDragEnd = () => {
    isDragging.current = false;
  };

  const shouldIgnoreToggle = () => isDragging.current;

  return {
    currentSortTuple,
    sortedTechnicians,
    sortedTechsById,
    orderedIds,
    handleSortChange,
    handleReorder,
    handleDragStart,
    handleDragEnd,
    shouldIgnoreToggle,
  };
};
