import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Technician } from "../../../../entities/technician/technician.types";
import { queryKeys } from "../../../../shared/api/queryKeys";
import { createTechnician } from "../api/createTechnician.api";

export const useCreateTechnicianMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTechnician,
    onSuccess: (technician) => {
      const addTechnicianToCache = (
        current: Technician[] | undefined,
      ): Technician[] =>
        [
          ...(current ?? []).filter((item) => item.id !== technician.id),
          technician,
        ].sort((a, b) => a.alias.localeCompare(b.alias));

      queryClient.setQueryData<Technician[]>(
        queryKeys.technicians.all,
        addTechnicianToCache,
      );

      if (technician.active) {
        queryClient.setQueryData<Technician[]>(
          queryKeys.technicians.active,
          addTechnicianToCache,
        );
      }

      void Promise.all([
        queryClient.invalidateQueries({ queryKey: ["technicians"] }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.technicianServiceZone,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.technicianSkillSet,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.technicianIgnoreList,
        }),
      ]);
    },
  });
};
