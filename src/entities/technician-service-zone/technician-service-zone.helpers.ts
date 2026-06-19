import type { ServiceZone } from "../service-zone/service-zone.types";
import type { TechnicianServiceZone } from "./technician-service-zone.types";

export const createZoneMapByTechId = (
  technicianZones: TechnicianServiceZone[],
) => {
  return technicianZones.reduce((map, techZone) => {
    const currentZones = map.get(techZone.technician_id) ?? new Set();
    currentZones.add(techZone.zone_id);
    map.set(techZone.technician_id, currentZones);

    return map;
  }, new Map<string, Set<string>>());
};

export const createTechnicianZoneNamesMap = (
  zones: ServiceZone[],
  technicianZones: TechnicianServiceZone[],
  existingZoneMapByTechId: Map<string, Set<string>> | null = null,
) => {
  const zonesByTechId = existingZoneMapByTechId
    ? existingZoneMapByTechId
    : createZoneMapByTechId(technicianZones);

  const resultMap = new Map<string, string[]>();

  const orderedZones = [...zones].sort(
    (a, b) => a.display_order - b.display_order,
  );

  for (const [techId, zoneIds] of zonesByTechId) {
    const names = orderedZones
      .filter((zone) => zoneIds.has(zone.id))
      .map((zone) => zone.name);

    resultMap.set(techId, names);
  }

  return resultMap;
};
