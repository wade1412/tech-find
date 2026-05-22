import type { Database } from "../../shared/api/supabase/database.types";

export type Brand = Database["public"]["Tables"]["brand"]["Row"];
