import { beforeEach, describe, expect, it } from "vitest";
import {
  clearPasswordRecoverySession,
  hasPasswordRecoverySession,
  markPasswordRecoverySession,
  parseImplicitEmailLink,
  parseSecureEmailLink,
} from "./auth.recovery";

describe("parseSecureEmailLink", () => {
  it.each(["recovery", "invite", "email", "signup"] as const)(
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

describe("parseImplicitEmailLink", () => {
  it("parses Supabase's default invite redirect fragment", () => {
    expect(
      parseImplicitEmailLink(
        "#access_token=access-123&refresh_token=refresh-123&type=invite",
      ),
    ).toEqual({
      accessToken: "access-123",
      refreshToken: "refresh-123",
      type: "invite",
    });
  });

  it("rejects a fragment without both session tokens", () => {
    expect(
      parseImplicitEmailLink("#access_token=access-123&type=invite"),
    ).toBeNull();
  });

  it("rejects an unsupported fragment type", () => {
    expect(
      parseImplicitEmailLink(
        "#access_token=access-123&refresh_token=refresh-123&type=magiclink",
      ),
    ).toBeNull();
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
