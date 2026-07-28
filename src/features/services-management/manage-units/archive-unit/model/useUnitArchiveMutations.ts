import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  archiveUnit,
  purgeUnit,
  restoreUnit,
} from "../../../../../entities/unit/unit.api";
import { queryKeys } from "../../../../../shared/api/queryKeys";

const useInvalidateUnitQueries = () => {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: ["units"] });
};

export const useArchiveUnitMutation = () => {
  const invalidateUnits = useInvalidateUnitQueries();

  return useMutation({
    mutationFn: archiveUnit,
    onSuccess: invalidateUnits,
  });
};

export const useRestoreUnitMutation = () => {
  const invalidateUnits = useInvalidateUnitQueries();

  return useMutation({
    mutationFn: restoreUnit,
    onSuccess: invalidateUnits,
  });
};

export const usePurgeUnitMutation = () => {
  const queryClient = useQueryClient();
  const invalidateUnits = useInvalidateUnitQueries();

  return useMutation({
    mutationFn: purgeUnit,
    onSuccess: (purgedId) =>
      Promise.all([
        invalidateUnits(),
        queryClient.removeQueries({
          queryKey: queryKeys.units.detail(purgedId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.specificIssues,
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
