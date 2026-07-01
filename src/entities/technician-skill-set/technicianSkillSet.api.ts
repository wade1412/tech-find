import { supabase } from "../../shared/api/supabase/supabaseClient";
import type {
  NewSkillInput,
  TechnicianSkill,
} from "./technicianSkillSet.types";

const TECHNICIAN_SKILL_SET_SELECT = `
        brand_group_id, 
        commercial,
        id,
        specific_issue_id,
        technician_id,
        unit_id
        `;

export const getTechnicianSkillSet = async (): Promise<TechnicianSkill[]> => {
  const { data, error } = await supabase
    .from("technician_skill_set")
    .select(TECHNICIAN_SKILL_SET_SELECT);

  if (error) throw error;

  return data ?? [];
};

export const addTechnicianSkills = async (
  technicianId: string,
  addedSkills: NewSkillInput[],
): Promise<void> => {
  if (addedSkills.length === 0) return;

  const { error } = await supabase.from("technician_skill_set").insert(
    addedSkills.map((skill) => ({
      brand_group_id: skill.brand_group_id,
      commercial: skill.commercial,
      specific_issue_id: skill.specific_issue_id,
      technician_id: technicianId,
      unit_id: skill.unit_id,
    })),
  );
  if (error) throw error;
};

export const removeTechnicianSkills = async (
  technicianId: string,
  removedSkillIds: string[],
): Promise<void> => {
  if (removedSkillIds.length === 0) return;

  const { error } = await supabase
    .from("technician_skill_set")
    .delete()
    .eq("technician_id", technicianId)
    .in("id", removedSkillIds);

  if (error) throw error;
};
