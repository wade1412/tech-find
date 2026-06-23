import { useQuery } from "@tanstack/react-query";
import { getAllTechnicians, getActiveTechnicians } from "./technician.api";
import { queryKeys } from "../../shared/api/queryKeys";

export const useTechniciansQuery = (status: "all" | "active" = "active") => {
  return useQuery({
    queryKey:
      status === "active"
        ? queryKeys.technicians.active
        : queryKeys.technicians.all,
    queryFn: status === "active" ? getActiveTechnicians : getAllTechnicians,
  });
};
