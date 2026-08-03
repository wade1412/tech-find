import type { Database } from "../../shared/api/supabase/database.types";

export type ServiceZone = Database["public"]["Tables"]["service_zone"]["Row"];
export type ServiceZoneInsert =
  Database["public"]["Tables"]["service_zone"]["Insert"];
export type ServiceZoneUpdate =
  Database["public"]["Tables"]["service_zone"]["Update"];
export type ServiceZoneStatus = "active" | "all" | "archived";
