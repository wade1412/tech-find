import type { Database } from "../../shared/api/supabase/database.types";

export type User = Database["public"]["Tables"]["user_profile"]["Row"];
