import { describe, expect, it } from "vitest";
import type { UserProfile } from "./auth.types";
import { validateUserProfile } from "./auth.profile";

const createProfile = (overrides: Partial<UserProfile> = {}): UserProfile => ({
  id: "user-1",
  email: "user@example.com",
  full_name: "Test User",
  alias: "Test",
  role: "user",
  active: true,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

describe("validateUserProfile", () => {
  it("returns profile when profile exists and is active", () => {
    const profile = createProfile();

    expect(validateUserProfile(profile)).toEqual(profile);
  });

  it("throws missing_profile error when profile is null", () => {
    expect(() => validateUserProfile(null)).toThrow(
      "Your user profile was not found. Please contact an administrator.",
    );

    try {
      validateUserProfile(null);
    } catch (error) {
      expect(error).toMatchObject({
        code: "missing_profile",
        message:
          "Your user profile was not found. Please contact an administrator.",
      });
    }
  });

  it("throws inactive_profile error when profile is inactive", () => {
    const inactiveProfile = createProfile({ active: false });

    expect(() => validateUserProfile(inactiveProfile)).toThrow(
      "Your account is inactive. Please contact an administrator.",
    );

    try {
      validateUserProfile(inactiveProfile);
    } catch (error) {
      expect(error).toMatchObject({
        code: "inactive_profile",
        message: "Your account is inactive. Please contact an administrator.",
      });
    }
  });
});
