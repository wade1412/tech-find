import type { Session, User } from "@supabase/supabase-js";
import type { Database } from "../../../shared/api/supabase/database.types";

export type UserProfile = Database["public"]["Tables"]["user_profile"]["Row"];

export type AuthErrorCode =
  | "invalid_credentials"
  | "inactive_profile"
  | "missing_profile"
  | "profile_request_failed"
  | "sign_out_failed";

export interface AppAuthError {
  code: AuthErrorCode;
  message: string;
  cause?: unknown;
}

export interface AuthContextValue {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;

  isLoading: boolean;
  isProfileLoading: boolean;
  isAuthenticated: boolean;

  authError: AppAuthError | null;
  clearAuthError: () => void;
  retryProfile: () => Promise<void>;

  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}
