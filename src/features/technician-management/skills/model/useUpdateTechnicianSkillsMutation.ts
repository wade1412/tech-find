import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { NewSkillInput } from "../../../../entities/technician-skill-set/technicianSkillSet.types";
import { queryKeys } from "../../../../shared/api/queryKeys";
import { updateTechnicianSkills as updateTechnicianSkillsApi } from "../../../../entities/technician-skill-set/technicianSkillSet.api";

type UpdateSkillsVariables = {
  technicianId: string;
  addedSkills: NewSkillInput[];
  removedSkillIds: string[];
};

const updateTechnicianSkills = async ({
  technicianId,
  addedSkills,
  removedSkillIds,
}: UpdateSkillsVariables) => {
  await updateTechnicianSkillsApi({
    technicianId,
    addedSkills,
    removedSkillIds,
  });
};

export const useUpdateTechnicianSkillsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTechnicianSkills,
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.technicianSkillSet }),
  });
};
