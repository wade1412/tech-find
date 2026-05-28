import type { Database } from "../../shared/api/supabase/database.types";

export type TechnicianSkill =
  Database["public"]["Tables"]["technician_skill_set"]["Row"];
