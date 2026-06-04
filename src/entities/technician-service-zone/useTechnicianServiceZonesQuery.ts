import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../shared/api/queryKeys";
import { getTechnicianServiceZones } from "./technician-service-zone.api";

export const useTechnicianServiceZonesQuery = () => {
  return useQuery({
    queryKey: queryKeys.technicianServiceZone,
    queryFn: getTechnicianServiceZones,
  });
};
