import type { Database } from "../../shared/api/supabase/database.types";

export type Unit = Database["public"]["Tables"]["unit"]["Row"];
export type UnitInsert = Database["public"]["Tables"]["unit"]["Insert"];
export type UnitUpdate = Database["public"]["Tables"]["unit"]["Update"];
export type UnitStatus = "active" | "all" | "archived";
