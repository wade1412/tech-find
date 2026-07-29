import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  archiveBrandGroup,
  purgeBrandGroup,
  restoreBrandGroup,
} from "../../../../entities/brandGroup/brandGroup.api";
import { queryKeys } from "../../../../shared/api/queryKeys";

const useInvalidateBrandHierarchy = () => {
  const queryClient = useQueryClient();

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["brand-groups"] }),
      queryClient.invalidateQueries({ queryKey: ["brands"] }),
    ]);
};

export const useArchiveBrandGroupMutation = () => {
  const invalidateBrandHierarchy = useInvalidateBrandHierarchy();

  return useMutation({
    mutationFn: archiveBrandGroup,
    onSuccess: invalidateBrandHierarchy,
  });
};

export const useRestoreBrandGroupMutation = () => {
  const invalidateBrandHierarchy = useInvalidateBrandHierarchy();

  return useMutation({
    mutationFn: restoreBrandGroup,
    onSuccess: invalidateBrandHierarchy,
  });
};

export const usePurgeBrandGroupMutation = () => {
  const queryClient = useQueryClient();
  const invalidateBrandHierarchy = useInvalidateBrandHierarchy();

  return useMutation({
    mutationFn: purgeBrandGroup,
    onSuccess: (purgedId) =>
      Promise.all([
        invalidateBrandHierarchy(),
        queryClient.removeQueries({
          queryKey: queryKeys.brandGroups.detail(purgedId),
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
