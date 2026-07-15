import { describe, expect, it } from "vitest";
import { shouldBypassProfileResolution } from "./auth.routes";

describe("shouldBypassProfileResolution", () => {
  it.each([
    "/secure-email-link",
    "/update-password",
    "/email-confirmation",
  ])("bypasses profile resolution on %s", (pathname) => {
    expect(shouldBypassProfileResolution(pathname)).toBe(true);
  });

  it.each(["/", "/login", "/forgot-password", "/technicians"])(
    "keeps normal profile resolution on %s",
    (pathname) => {
      expect(shouldBypassProfileResolution(pathname)).toBe(false);
    },
  );
});
