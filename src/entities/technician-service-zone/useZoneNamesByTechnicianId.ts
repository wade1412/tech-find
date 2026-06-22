import { useMemo } from "react";
import { useServiceZonesQuery } from "../service-zone/useServiceZonesQuery";
import { useTechnicianServiceZonesQuery } from "./useTechnicianServiceZonesQuery";
import { createTechnicianZoneNamesMap } from "./technician-service-zone.helpers";

export const useZoneNamesByTechnicianId = () => {
  const {
    data: zones,
    isPending: isZonesPending,
    isError: isZonesError,
    error: zonesError,
  } = useServiceZonesQuery();
  const {
    data: technicianZones,
    isPending: isTechnicianZonesPending,
    isError: isTechnicianZonesError,
    error: technicianZonesError,
  } = useTechnicianServiceZonesQuery();

  const zoneNamesByTechnicianId = useMemo(
    () => createTechnicianZoneNamesMap(zones ?? [], technicianZones ?? []),
    [zones, technicianZones],
  );

  const isPending = isZonesPending || isTechnicianZonesPending;
  const isError = isZonesError || isTechnicianZonesError;
  const error = zonesError ?? technicianZonesError;

  return {
    zoneNamesByTechnicianId,
    isPending,
    isError,
    error,
  };
};
