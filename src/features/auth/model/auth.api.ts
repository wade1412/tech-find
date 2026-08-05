import { supabase } from "../../../shared/api/supabase/supabaseClient";
import type { UserProfile } from "./auth.types";

export const getUserProfile = async (
  userId: string,
): Promise<UserProfile | null> => {
  const { data, error } = await supabase
    .from("user_profile")
    .select(
      "id, email, full_name, alias, role, active, created_at, updated_at, archived_at, archived_by, active_before_archive",
    )
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;

  return data;
};
