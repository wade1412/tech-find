// Helper for creating data maps by Id
export function createDataMapByTechnicianId<
  T extends { technician_id: string },
>(technicianData: T[]): Map<string, T[]> {
  const map = new Map<string, T[]>();

  for (const item of technicianData) {
    const currentItems = map.get(item.technician_id) ?? [];
    currentItems.push(item);
    map.set(item.technician_id, currentItems);
  }

  return map;
}
