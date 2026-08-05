import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createServiceZone,
  updateServiceZone,
} from "../../../../entities/service-zone/service-zone.api";
import type {
  ServiceZoneInsert,
  ServiceZoneUpdate,
} from "../../../../entities/service-zone/service-zone.types";
import { queryKeys } from "../../../../shared/api/queryKeys";

interface UpdateServiceZoneVariables {
  id: string;
  patch: ServiceZoneUpdate;
}

const invalidateServiceZones = (
  queryClient: ReturnType<typeof useQueryClient>,
) => queryClient.invalidateQueries({ queryKey: ["service-zones"] });

export const useCreateServiceZoneMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ServiceZoneInsert) => createServiceZone(input),
    onSuccess: (serviceZone) => {
      queryClient.setQueryData(
        queryKeys.serviceZones.detail(serviceZone.id),
        serviceZone,
      );
      return invalidateServiceZones(queryClient);
    },
  });
};

export const useUpdateServiceZoneMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, patch }: UpdateServiceZoneVariables) =>
      updateServiceZone(id, patch),
    onSuccess: (serviceZone) => {
      queryClient.setQueryData(
        queryKeys.serviceZones.detail(serviceZone.id),
        serviceZone,
      );
      return invalidateServiceZones(queryClient);
    },
  });
};
