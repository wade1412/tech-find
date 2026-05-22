import type { Database } from "../../shared/api/supabase/database.types";

export type Technician = Database["public"]["Tables"]["technician"]["Row"];
