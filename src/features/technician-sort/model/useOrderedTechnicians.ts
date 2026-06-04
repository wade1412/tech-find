import { useCallback, useMemo, useRef, useState } from "react";
import { sortTechnicians } from "./sortTechnicians";
import { parseStringToSortTuple } from "./sortHelpers";
import type { Technician } from "../../../entities/technician/technician.types";
import type { SortTuple } from "./technicianSort.types";

type UseOrderedTechniciansResult = {
  currentSortTuple: SortTuple;
  sortedTechnicians: Technician[];
  techniciansById: Map<string, Technician>;
  orderedIds: string[];
  handleSortChange: (newSort: string) => void;
  handleReorder: (newOrder: string[]) => void;
  handleDragStart: () => void;
  handleDragEnd: () => void;
  shouldIgnoreToggle: () => boolean;
};

export const useOrderedTechnicians = (
  technicians: Technician[],
  sort: string,
  orderKey: string,
  updateSort: (newSort: string) => void,
): UseOrderedTechniciansResult => {
  const [customOrder, setCustomOrder] = useState<{
    key: string;
    ids: string[];
  }>({ key: "", ids: [] });
  const isDragging = useRef(false);
  const justDragged = useRef(false);

  const currentSortTuple = useMemo(() => parseStringToSortTuple(sort), [sort]);
  const [mode, direction] = currentSortTuple;

  const sortedTechnicians = useMemo(() => {
    return sortTechnicians(technicians, {
      sortMode: mode,
      sortDirection: direction,
    });
  }, [technicians, mode, direction]);

  const techniciansById = useMemo(
    () => new Map(sortedTechnicians.map((t) => [t.id, t])),
    [sortedTechnicians],
  );

  const orderedIds = useMemo(() => {
    const { key, ids } = customOrder;
    const sortedIds = Array.from(techniciansById.keys());

    const hasCustomOrder = key === orderKey && ids.length > 0;

    if (!hasCustomOrder) {
      return sortedIds;
    }

    const customOrderSet = new Set(customOrder.ids);

    return [
      // Return only relevant ids
      ...customOrder.ids.filter((id) => techniciansById.has(id)),
      ...sortedIds.filter((id) => !customOrderSet.has(id)),
    ];
  }, [customOrder, orderKey, techniciansById]);

  const handleSortChange = useCallback(
    (newSort: string) => {
      setCustomOrder({ key: "", ids: [] });
      updateSort(newSort);
    },
    [updateSort],
  );

  const handleReorder = useCallback(
    (newOrder: string[]) => {
      if (!isDragging.current) return;
      setCustomOrder({ key: orderKey, ids: newOrder });
    },
    [orderKey],
  );

  const handleDragStart = useCallback(() => {
    isDragging.current = true;
  }, []);

  const handleDragEnd = useCallback(() => {
    isDragging.current = false;
    justDragged.current = true;
    setTimeout(() => (justDragged.current = false), 100);
  }, []);

  const shouldIgnoreToggle = useCallback(
    () => isDragging.current || justDragged.current,
    [],
  );

  return {
    currentSortTuple,
    sortedTechnicians,
    techniciansById,
    orderedIds,
    handleSortChange,
    handleReorder,
    handleDragStart,
    handleDragEnd,
    shouldIgnoreToggle,
  };
};
