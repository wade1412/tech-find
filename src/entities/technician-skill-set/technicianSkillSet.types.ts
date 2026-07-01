import type { Database } from "../../shared/api/supabase/database.types";

export type NewSkillInput = {
  brand_group_id: string | null;
  commercial: boolean;
  specific_issue_id: string | null;
  unit_id: string;
};

export type TechnicianSkill =
  Database["public"]["Tables"]["technician_skill_set"]["Row"];
