import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  archiveTechnician,
  purgeTechnician,
  restoreTechnician,
} from "../../../../entities/technician/technician.api";
import { queryKeys } from "../../../../shared/api/queryKeys";

const useInvalidateTechnicianQueries = () => {
  const queryClient = useQueryClient();

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.technicians.active }),
      queryClient.invalidateQueries({ queryKey: queryKeys.technicians.all }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.technicians.archived,
      }),
    ]);
};

export const useArchiveTechnicianMutation = () => {
  const invalidateTechnicians = useInvalidateTechnicianQueries();

  return useMutation({
    mutationFn: archiveTechnician,
    onSuccess: invalidateTechnicians,
  });
};

export const useRestoreTechnicianMutation = () => {
  const invalidateTechnicians = useInvalidateTechnicianQueries();

  return useMutation({
    mutationFn: restoreTechnician,
    onSuccess: invalidateTechnicians,
  });
};

export const usePurgeTechnicianMutation = () => {
  const queryClient = useQueryClient();
  const invalidateTechnicians = useInvalidateTechnicianQueries();

  return useMutation({
    mutationFn: purgeTechnician,
    onSuccess: () =>
      Promise.all([
        invalidateTechnicians(),
        queryClient.invalidateQueries({
          queryKey: queryKeys.technicianServiceZone,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.technicianSkillSet,
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.technicianIgnoreList,
        }),
      ]),
  });
};
