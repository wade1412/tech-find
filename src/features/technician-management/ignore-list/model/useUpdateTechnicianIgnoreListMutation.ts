import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../../shared/api/queryKeys";
import { updateTechnicianIgnoreListApi } from "../../../../entities/technician-ignore-list/technicianIgnoreList.api";

export const useUpdateTechnicianIgnoreListMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTechnicianIgnoreListApi,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.technicianIgnoreList,
      }),
  });
};
