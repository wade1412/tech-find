import { describe, expect, it } from "vitest";
import { shouldLoadProfile } from "./auth.session";

describe("shouldLoadProfile", () => {
  it("returns true when there is no loaded profile", () => {
    expect(
      shouldLoadProfile({
        userId: "user-1",
      }),
    ).toBe(true);
  });

  it("returns false when profile already belongs to the same user", () => {
    expect(
      shouldLoadProfile({
        userId: "user-1",
        profileUserId: "user-1",
      }),
    ).toBe(false);
  });

  it("returns false when the same user profile is already resolving", () => {
    expect(
      shouldLoadProfile({
        userId: "user-1",
        resolvingUserId: "user-1",
      }),
    ).toBe(false);
  });

  it("returns true when force is true and profile belongs to the same user", () => {
    expect(
      shouldLoadProfile({
        userId: "user-1",
        profileUserId: "user-1",
        force: true,
      }),
    ).toBe(true);
  });

  it("returns false when force is true but the same user is already resolving", () => {
    expect(
      shouldLoadProfile({
        userId: "user-1",
        profileUserId: "user-1",
        resolvingUserId: "user-1",
        force: true,
      }),
    ).toBe(false);
  });
});
