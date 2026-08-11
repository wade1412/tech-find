import { describe, it, expect } from "vitest";
import {
  PASSWORD_ERROR_TEXTS,
  validateNewPassword,
} from "./auth.password-policy";

describe("validateNewPassword", () => {
  it("rejects a password shorter than 12 characters", () => {
    expect(validateNewPassword(`Test`, `Test`)).toBe(
      PASSWORD_ERROR_TEXTS.length,
    );
  });

  it("reject a password without lowercase", () => {
    expect(validateNewPassword(`TESTPASSWORD1`, `TESTPASSWORD1`)).toBe(
      PASSWORD_ERROR_TEXTS.lowercase,
    );
  });

  it("rejects a password without uppercase", () => {
    expect(validateNewPassword(`testpassword1`, `testpassword1`)).toBe(
      PASSWORD_ERROR_TEXTS.uppercase,
    );
  });

  it("rejects a password without a digit", () => {
    expect(validateNewPassword(`Testpassword`, `Testpassword`)).toBe(
      PASSWORD_ERROR_TEXTS.digit,
    );
  });

  it("rejects mismatched confirmation", () => {
    expect(validateNewPassword(`Testpassword1`, `Testpassword12`)).toBe(
      PASSWORD_ERROR_TEXTS.confirmation,
    );
  });

  it("accepts a password satisfying every requirement", () => {
    expect(validateNewPassword(`Testpassword123`, `Testpassword123`)).toEqual(
      null,
    );
  });

  it("does not trim passwords during confirmation comparison", () => {
    const password = " Pass12345678 ";
    const trimmedConfirmation = password.trim();

    expect(validateNewPassword(password, trimmedConfirmation)).toBe(
      PASSWORD_ERROR_TEXTS.confirmation,
    );
  });

  it("does not trim or mutate password", () => {
    const rawPassword = "  TestPassword12";
    const rawConfirmation = "  TestPassword12";

    const passwordRef = String(rawPassword);
    const confirmationRef = String(rawConfirmation);

    validateNewPassword(passwordRef, confirmationRef);

    expect(passwordRef).toBe("  TestPassword12");
    expect(confirmationRef).toBe("  TestPassword12");
  });
});
