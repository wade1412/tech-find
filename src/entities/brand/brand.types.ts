import type { Database } from "../../shared/api/supabase/database.types";

export type Brand = Database["public"]["Tables"]["brand"]["Row"];
export type BrandInsert = Database["public"]["Tables"]["brand"]["Insert"];
export type BrandUpdate = Database["public"]["Tables"]["brand"]["Update"];
export type BrandStatus = "active" | "all" | "archived";
