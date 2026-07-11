import type { Database } from "../../shared/api/supabase/database.types";

export type TechnicianIgnoreList =
  Database["public"]["Tables"]["technician_ignore_list"]["Row"];

export type NewIgnoreItemInput = Pick<
  Database["public"]["Tables"]["technician_ignore_list"]["Insert"],
  "brand_id" | "specific_issue_id" | "unit_id"
>;
