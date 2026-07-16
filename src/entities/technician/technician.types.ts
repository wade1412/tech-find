import type { Database } from "../../shared/api/supabase/database.types";

export type Technician = Database["public"]["Tables"]["technician"]["Row"];

type TechnicianTableUpdate =
  Database["public"]["Tables"]["technician"]["Update"];

export type TechnicianUpdate = Omit<
  TechnicianTableUpdate,
  "id" | "archived_at" | "archived_by" | "active_before_archive"
>;

export type TechnicianInsert = Omit<
  Database["public"]["Tables"]["technician"]["Insert"],
  "id" | "archived_at" | "archived_by" | "active_before_archive"
>;
