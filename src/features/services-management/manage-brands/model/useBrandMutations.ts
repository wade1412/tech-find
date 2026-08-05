import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBrand,
  updateBrand,
} from "../../../../entities/brand/brand.api";
import type {
  BrandInsert,
  BrandUpdate,
} from "../../../../entities/brand/brand.types";
import { queryKeys } from "../../../../shared/api/queryKeys";

interface UpdateBrandVariables {
  id: string;
  patch: BrandUpdate;
}

const invalidateBrands = (queryClient: ReturnType<typeof useQueryClient>) =>
  queryClient.invalidateQueries({ queryKey: ["brands"] });

export const useCreateBrandMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: BrandInsert) => createBrand(input),
    onSuccess: (brand) => {
      queryClient.setQueryData(queryKeys.brands.detail(brand.id), brand);
      return invalidateBrands(queryClient);
    },
  });
};

export const useUpdateBrandMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, patch }: UpdateBrandVariables) =>
      updateBrand(id, patch),
    onSuccess: (brand) => {
      queryClient.setQueryData(queryKeys.brands.detail(brand.id), brand);
      return invalidateBrands(queryClient);
    },
  });
};
