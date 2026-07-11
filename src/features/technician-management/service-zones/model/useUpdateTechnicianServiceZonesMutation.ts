import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../../shared/api/queryKeys";
import { updateTechnicianServiceZonesApi } from "../../../../entities/technician-service-zone/technician-service-zone.api";

export const useUpdateTechnicianServiceZonesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTechnicianServiceZonesApi,
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.technicianServiceZone,
      }),
  });
};
