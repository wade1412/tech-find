import type { Database } from "../../shared/api/supabase/database.types";

export type Technician = Database["public"]["Tables"]["technician"]["Row"];

export type TechnicianUpdate =
  Database["public"]["Tables"]["technician"]["Update"];

export type TechnicianInsert =
  Database["public"]["Tables"]["technician"]["Insert"];
