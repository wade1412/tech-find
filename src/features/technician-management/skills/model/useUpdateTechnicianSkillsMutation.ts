import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../../shared/api/queryKeys";
import { updateTechnicianSkillsApi } from "../../../../entities/technician-skill-set/technicianSkillSet.api";

export const useUpdateTechnicianSkillsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTechnicianSkillsApi,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.technicianSkillSet,
      }),
  });
};
