import { createAuthError } from "./auth.errors";
import type { UserProfile } from "./auth.types";

export function validateUserProfile(profile: UserProfile | null): UserProfile {
  if (!profile) {
    throw createAuthError(
      "missing_profile",
      "Your user profile was not found. Please contact an administrator.",
    );
  }

  if (profile.archived_at) {
    throw createAuthError(
      "inactive_profile",
      "Your account is archived. Please contact an owner if you need access restored.",
    );
  }

  if (!profile.active) {
    throw createAuthError(
      "inactive_profile",
      "Your account is inactive. Please contact an administrator.",
    );
  }

  return profile;
}
