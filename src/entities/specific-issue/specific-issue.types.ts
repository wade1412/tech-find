import type { Database } from "../../shared/api/supabase/database.types";

export type SpecificIssue =
  Database["public"]["Tables"]["specific_issue"]["Row"];
