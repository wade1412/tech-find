import { useQuery } from "@tanstack/react-query";
import { getTechnicians } from "./technician.api";
import { queryKeys } from "../../shared/api/queryKeys";

export const useTechniciansQuery = () => {
  return useQuery({
    queryKey: queryKeys.technicians,
    queryFn: getTechnicians,
  });
};
