import { useQuery } from "@tanstack/react-query";
import {
  getAllTechnicians,
  getActiveTechnicians,
  getArchivedTechnicians,
} from "./technician.api";
import type { Technician } from "./technician.types";

type TechnicianQueryStatus = "all" | "active" | "archived";

export const useTechniciansQuery = (
  status: TechnicianQueryStatus = "active",
  enabled = true,
) => {
  return useQuery<Technician[]>({
    queryKey: ["technicians", status],
    queryFn: () => {
      if (status === "archived") return getArchivedTechnicians();
      if (status === "all") return getAllTechnicians();
      return getActiveTechnicians();
    },
    enabled,
  });
};
