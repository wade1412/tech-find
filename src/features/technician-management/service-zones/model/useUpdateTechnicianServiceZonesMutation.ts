import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../../shared/api/queryKeys";
import {
  addTechnicianServiceZones,
  deleteTechnicianServiceZones,
} from "../../../../entities/technician-service-zone/technician-service-zone.api";

type UpdateZonesVariables = {
  technicianId: string;
  addedIds: string[];
  removedIds: string[];
};

const updateTechnicianServiceZones = async ({
  technicianId,
  addedIds,
  removedIds,
}: UpdateZonesVariables) => {
  await deleteTechnicianServiceZones(technicianId, removedIds);
  await addTechnicianServiceZones(technicianId, addedIds);
};

export const useUpdateTechnicianServiceZonesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTechnicianServiceZones,
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.technicianServiceZone,
      }),
  });
};
