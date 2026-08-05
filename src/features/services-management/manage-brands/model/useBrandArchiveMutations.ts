import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  archiveBrand,
  purgeBrand,
  restoreBrand,
} from "../../../../entities/brand/brand.api";
import { queryKeys } from "../../../../shared/api/queryKeys";

const useInvalidateBrandQueries = () => {
  const queryClient = useQueryClient();

  return () => queryClient.invalidateQueries({ queryKey: ["brands"] });
};

export const useArchiveBrandMutation = () => {
  const invalidateBrands = useInvalidateBrandQueries();

  return useMutation({
    mutationFn: archiveBrand,
    onSuccess: invalidateBrands,
  });
};

export const useRestoreBrandMutation = () => {
  const invalidateBrands = useInvalidateBrandQueries();

  return useMutation({
    mutationFn: restoreBrand,
    onSuccess: invalidateBrands,
  });
};

export const usePurgeBrandMutation = () => {
  const queryClient = useQueryClient();
  const invalidateBrands = useInvalidateBrandQueries();

  return useMutation({
    mutationFn: purgeBrand,
    onSuccess: (purgedId) =>
      Promise.all([
        invalidateBrands(),
        queryClient.removeQueries({
          queryKey: queryKeys.brands.detail(purgedId),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.technicianIgnoreList,
        }),
      ]),
  });
};
