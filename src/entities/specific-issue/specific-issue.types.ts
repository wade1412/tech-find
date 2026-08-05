import type { Database } from "../../shared/api/supabase/database.types";

export type SpecificIssue =
  Database["public"]["Tables"]["specific_issue"]["Row"];
export type SpecificIssueInsert =
  Database["public"]["Tables"]["specific_issue"]["Insert"];
export type SpecificIssueUpdate =
  Database["public"]["Tables"]["specific_issue"]["Update"];
export type SpecificIssueStatus = "active" | "all" | "archived";
