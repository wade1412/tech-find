import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TechnicianUpdate } from "../../../entities/technician/technician.types";
import { updateTechnician } from "../../../entities/technician/technician.api";

type UpdateTechnicianVariables = {
  id: string;
  patch: TechnicianUpdate;
};

export const useUpdateTechnicianMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, patch }: UpdateTechnicianVariables) =>
      updateTechnician(id, patch),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["technicians"] }),
  });
};
