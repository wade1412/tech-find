import { beforeEach, describe, expect, it } from "vitest";
import {
  clearPasswordRecoverySession,
  hasPasswordRecoverySession,
  markPasswordRecoverySession,
  parseSecureEmailLink,
  validateNewPassword,
} from "./auth.recovery";

describe("parseSecureEmailLink", () => {
  it.each(["recovery", "email", "signup"] as const)(
    "parses a valid %s link",
    (type) => {
      expect(
        parseSecureEmailLink(`?token_hash=token-123&type=${type}`),
      ).toEqual({
        success: true,
        params: { tokenHash: "token-123", type },
      });
    },
  );

  it("rejects a link without a token hash", () => {
    expect(parseSecureEmailLink("?type=recovery")).toEqual({
      success: false,
      error: "This email link is incomplete or invalid.",
    });
  });

  it("rejects an unsupported link type", () => {
    expect(
      parseSecureEmailLink("?token_hash=token-123&type=magiclink"),
    ).toEqual({
      success: false,
      error: "This email link type is not supported.",
    });
  });
});

describe("password recovery marker", () => {
  beforeEach(() => {
    clearPasswordRecoverySession();
    window.sessionStorage.clear();
  });

  it("grants access only to the marked recovery user", () => {
    markPasswordRecoverySession("recovery-user");

    expect(hasPasswordRecoverySession("recovery-user")).toBe(true);
    expect(hasPasswordRecoverySession("another-user")).toBe(false);
  });

  it("revokes access when the recovery flow completes", () => {
    markPasswordRecoverySession("recovery-user");
    clearPasswordRecoverySession();

    expect(hasPasswordRecoverySession("recovery-user")).toBe(false);
  });
});

describe("validateNewPassword", () => {
  it("rejects passwords shorter than eight characters", () => {
    expect(validateNewPassword("short", "short")).toBe(
      "Password must contain at least 8 characters.",
    );
  });

  it("rejects different password values", () => {
    expect(validateNewPassword("password-one", "password-two")).toBe(
      "Passwords do not match.",
    );
  });

  it("accepts matching valid passwords", () => {
    expect(validateNewPassword("password-one", "password-one")).toBeNull();
  });
});
