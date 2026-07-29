import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createBrandGroup,
  updateBrandGroup,
} from "../../../../entities/brandGroup/brandGroup.api";
import type {
  BrandGroupInsert,
  BrandGroupUpdate,
} from "../../../../entities/brandGroup/brandGroup.types";
import { queryKeys } from "../../../../shared/api/queryKeys";

interface UpdateBrandGroupVariables {
  id: string;
  patch: BrandGroupUpdate;
}

const invalidateBrandGroups = (
  queryClient: ReturnType<typeof useQueryClient>,
) => queryClient.invalidateQueries({ queryKey: ["brand-groups"] });

export const useCreateBrandGroupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: BrandGroupInsert) => createBrandGroup(input),
    onSuccess: (brandGroup) => {
      queryClient.setQueryData(
        queryKeys.brandGroups.detail(brandGroup.id),
        brandGroup,
      );
      return invalidateBrandGroups(queryClient);
    },
  });
};

export const useUpdateBrandGroupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, patch }: UpdateBrandGroupVariables) =>
      updateBrandGroup(id, patch),
    onSuccess: (brandGroup) => {
      queryClient.setQueryData(
        queryKeys.brandGroups.detail(brandGroup.id),
        brandGroup,
      );

      return Promise.all([
        invalidateBrandGroups(queryClient),
        queryClient.invalidateQueries({ queryKey: ["brands"] }),
      ]);
    },
  });
};
