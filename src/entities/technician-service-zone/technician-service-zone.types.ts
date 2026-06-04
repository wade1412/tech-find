import type { Database } from "../../shared/api/supabase/database.types";

export type TechnicianServiceZone =
  Database["public"]["Tables"]["technician_service_zone"]["Row"];
