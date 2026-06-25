import { createAuthError } from "./auth.errors";
import type { UserProfile } from "./auth.types";

export function validateUserProfile(profile: UserProfile | null): UserProfile {
  if (!profile) {
    throw createAuthError(
      "missing_profile",
      "Your user profile was not found. Please contact an administrator.",
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
