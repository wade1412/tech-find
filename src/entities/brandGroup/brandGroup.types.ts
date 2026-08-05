import type { Database } from "../../shared/api/supabase/database.types";

export type BrandGroup = Database["public"]["Tables"]["brand_group"]["Row"];
export type BrandGroupInsert =
  Database["public"]["Tables"]["brand_group"]["Insert"];
export type BrandGroupUpdate =
  Database["public"]["Tables"]["brand_group"]["Update"];
export type BrandGroupStatus = "active" | "all" | "archived";
