import type { Database } from "../../shared/api/supabase/database.types";

export type ServiceZone = Database["public"]["Tables"]["service_zone"]["Row"];
