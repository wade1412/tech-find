import type { Database } from "../../shared/api/supabase/database.types";

export type TechnicianSkillSet =
  Database["public"]["Tables"]["technician_skill_set"]["Row"];
