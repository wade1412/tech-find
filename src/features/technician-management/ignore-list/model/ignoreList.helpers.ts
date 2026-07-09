import type { TechnicianIgnoreList } from "../../../../entities/technician-ignore-list/technicianIgnoreList.types";
import type { IgnoreItemDraft } from "./ignoreList.types";

type IgnoreListPatch = {
  addedItems: IgnoreItemDraft[];
  removedItemsIds: string[];
};

export const createIgnoreItemDraft = (
  item: TechnicianIgnoreList,
): IgnoreItemDraft => ({
  key: item.id ?? crypto.randomUUID(),
  sourceId: item.id ?? null,
  technician_id: item.technician_id,
  unit_id: item.unit_id ?? null,
  brand_id: item.brand_id ?? null,
  specific_issue_id: item.specific_issue_id ?? null,
});

const getValue = (id: string | null) => id ?? "*";

export const getIgnoreItemIdentity = (item: IgnoreItemDraft) =>
  [
    item.technician_id,
    getValue(item.unit_id),
    getValue(item.brand_id),
    getValue(item.specific_issue_id),
  ].join("|");

export const isEmptyIgnoreItem = (item: IgnoreItemDraft) => {
  if (!item.unit_id && !item.brand_id && !item.specific_issue_id) return true;

  return false;
};

export const isDuplicateIgnoreItem = (
  item: IgnoreItemDraft,
  currentItemsDraft: IgnoreItemDraft[],
) => {
  if (
    new Set(currentItemsDraft.map((item) => getIgnoreItemIdentity(item))).has(
      getIgnoreItemIdentity(item),
    )
  )
    return true;

  return false;
};

export const createIgnoreListPatch = (
  initialIgnoreList: TechnicianIgnoreList[],
  draftIgnoreList: IgnoreItemDraft[],
): IgnoreListPatch => {
  const initialListIds = new Set(initialIgnoreList.map((item) => item.id));
  const draftListIds = new Set(
    draftIgnoreList.map((item) => item.sourceId).filter((id) => id !== null),
  );

  const addedItems = draftIgnoreList.filter((item) => item.sourceId === null);

  const removedItemsIds = Array.from(initialListIds).filter(
    (id) => !draftListIds.has(id),
  );

  return {
    addedItems,
    removedItemsIds,
  };
};
