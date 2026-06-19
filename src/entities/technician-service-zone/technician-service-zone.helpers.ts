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
  const zoneNamesById = new Map(zones.map((zone) => [zone.id, zone.name]));

  const zonesByTechId = existingZoneMapByTechId
    ? existingZoneMapByTechId
    : createZoneMapByTechId(technicianZones);

  const resultMap = new Map<string, string[]>();

  for (const [techId, zoneIds] of zonesByTechId) {
    const names = Array.from(zoneIds)
      .map((zoneId) => zoneNamesById.get(zoneId))
      .filter(Boolean) as string[];

    resultMap.set(techId, names);
  }

  return resultMap;
};
