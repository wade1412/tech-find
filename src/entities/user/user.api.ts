import { supabase } from "../../shared/api/supabase/supabaseClient";
import type { User } from "./user.types";

const USER_SELECT = `active,
    alias,
    created_at,
    email,
    full_name,
    id,
    role,
    updated_at`;

export const getAllUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from("user_profile")
    .select(USER_SELECT);

  if (error) throw error;

  return data ?? [];
};
