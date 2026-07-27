import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createUnit,
  updateUnit,
} from "../../../../entities/unit/unit.api";
import type {
  UnitInsert,
  UnitUpdate,
} from "../../../../entities/unit/unit.types";
import { queryKeys } from "../../../../shared/api/queryKeys";

interface UpdateUnitVariables {
  id: string;
  patch: UnitUpdate;
}

const invalidateUnits = (queryClient: ReturnType<typeof useQueryClient>) =>
  queryClient.invalidateQueries({ queryKey: ["units"] });

export const useCreateUnitMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UnitInsert) => createUnit(input),
    onSuccess: (unit) => {
      queryClient.setQueryData(queryKeys.units.detail(unit.id), unit);
      return invalidateUnits(queryClient);
    },
  });
};

export const useUpdateUnitMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, patch }: UpdateUnitVariables) =>
      updateUnit(id, patch),
    onSuccess: (unit) => {
      queryClient.setQueryData(queryKeys.units.detail(unit.id), unit);
      return invalidateUnits(queryClient);
    },
  });
};
