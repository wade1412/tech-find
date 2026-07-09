import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../../shared/api/queryKeys";

export const useUpdateTechnicianIgnoreListMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.technicianIgnoreList,
      }),
  });
};
