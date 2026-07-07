type TechnicianZonesPatch = {
  addedIds: string[];
  removedIds: string[];
};

export const buildTechnicianZonesPatch = (
  originalIdsSet: ReadonlySet<string>,
  draftIdsSet: ReadonlySet<string>,
): TechnicianZonesPatch => {
  const addedIds = Array.from(draftIdsSet).filter(
    (id) => !originalIdsSet.has(id),
  );
  const removedIds = Array.from(originalIdsSet).filter(
    (id) => !draftIdsSet.has(id),
  );

  return {
    addedIds,
    removedIds,
  };
};
