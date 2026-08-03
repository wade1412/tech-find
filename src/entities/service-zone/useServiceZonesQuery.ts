import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../shared/api/queryKeys";
import { getServiceZones } from "./service-zone.api";
import type { ServiceZoneStatus } from "./service-zone.types";

export const useServiceZonesQuery = (
  status: ServiceZoneStatus = "active",
  enabled = true,
) => {
  return useQuery({
    queryKey: queryKeys.serviceZones[status],
    queryFn: () => getServiceZones(status),
    enabled,
  });
};
