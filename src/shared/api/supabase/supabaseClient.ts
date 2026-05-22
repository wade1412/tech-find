import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Guard for missing values
if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase env variables");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
