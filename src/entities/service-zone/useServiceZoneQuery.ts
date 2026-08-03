import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../shared/api/queryKeys";
import { getServiceZoneById } from "./service-zone.api";

export const useServiceZoneQuery = (serviceZoneId: string | undefined) =>
  useQuery({
    queryKey: queryKeys.serviceZones.detail(serviceZoneId ?? "missing"),
    queryFn: () =>
      serviceZoneId
        ? getServiceZoneById(serviceZoneId)
        : Promise.resolve(null),
    enabled: Boolean(serviceZoneId),
  });
