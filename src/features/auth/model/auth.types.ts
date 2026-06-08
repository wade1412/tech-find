import type { Database } from "../../../shared/api/supabase/database.types";

export type UserProfile = Database["public"]["Tables"]["user_profile"]["Row"];
