import type { Database } from "../../shared/api/supabase/database.types";

export type TechnicianIgnoreList =
  Database["public"]["Tables"]["technician_ignore_list"]["Row"];
