import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  archiveServiceZone,
  purgeServiceZone,
  restoreServiceZone,
} from "../../../../entities/service-zone/service-zone.api";
import { queryKeys } from "../../../../shared/api/queryKeys";

const useInvalidateServiceZoneDependencies = () => {
  const queryClient = useQueryClient();

  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["service-zones"] }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.technicianServiceZone,
      }),
    ]);
};

export const useArchiveServiceZoneMutation = () => {
  const invalidateDependencies = useInvalidateServiceZoneDependencies();

  return useMutation({
    mutationFn: archiveServiceZone,
    onSuccess: invalidateDependencies,
  });
};

export const useRestoreServiceZoneMutation = () => {
  const invalidateDependencies = useInvalidateServiceZoneDependencies();

  return useMutation({
    mutationFn: restoreServiceZone,
    onSuccess: invalidateDependencies,
  });
};

export const usePurgeServiceZoneMutation = () => {
  const queryClient = useQueryClient();
  const invalidateDependencies = useInvalidateServiceZoneDependencies();

  return useMutation({
    mutationFn: purgeServiceZone,
    onSuccess: (purgedId) =>
      Promise.all([
        invalidateDependencies(),
        queryClient.removeQueries({
          queryKey: queryKeys.serviceZones.detail(purgedId),
        }),
      ]),
  });
};
