import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../shared/api/queryKeys";
import { getServiceZones } from "./service-zone.api";

export const useServiceZonesQuery = () => {
  return useQuery({
    queryKey: queryKeys.serviceZone,
    queryFn: getServiceZones,
  });
};
