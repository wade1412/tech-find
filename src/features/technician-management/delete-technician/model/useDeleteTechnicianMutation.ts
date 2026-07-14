import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTechnician } from "../../../../entities/technician/technician.api";
import { queryKeys } from "../../../../shared/api/queryKeys";

export const useDeleteTechnicianMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTechnician,
    onSuccess: () => {
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
