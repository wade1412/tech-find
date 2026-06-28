type TechnicianZonesPatch = {
  addedIds: string[];
  removedIds: string[];
};

export const buildTechnicianZonesPatch = (
  originalIds: ReadonlySet<string>,
  draftIdsSet: ReadonlySet<string>,
): TechnicianZonesPatch => {
  const addedIds = Array.from(draftIdsSet).filter((id) => !originalIds.has(id));
  const removedIds = Array.from(originalIds).filter(
    (id) => !draftIdsSet.has(id),
  );

  return {
    addedIds,
    removedIds,
  };
};
