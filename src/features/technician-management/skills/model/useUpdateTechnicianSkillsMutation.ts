import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addTechnicianSkills,
  deleteTechnicianSkills,
} from "../../../../entities/technician-skill-set/technicianSkillSet.api";
import type { NewSkillInput } from "../../../../entities/technician-skill-set/technicianSkillSet.types";
import { queryKeys } from "../../../../shared/api/queryKeys";

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
  await deleteTechnicianSkills(technicianId, removedSkillIds);
  await addTechnicianSkills(technicianId, addedSkills);
};

export const useUpdateTechnicianSkillsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTechnicianSkills,
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.technicianSkillSet }),
  });
};
