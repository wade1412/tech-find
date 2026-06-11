import type { Database } from "../../../shared/api/supabase/database.types";
import type { Session, User } from "@supabase/supabase-js";

export type UserProfile = Database["public"]["Tables"]["user_profile"]["Row"];

export type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isProfileLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};
