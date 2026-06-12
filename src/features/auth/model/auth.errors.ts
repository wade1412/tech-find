import type { AppAuthError } from "./auth.types";

export const createAuthError = (
  code: AppAuthError["code"],
  message: string,
  cause?: unknown,
) => {
  return { code, message, cause };
};

export const isAppAuthError = (error: unknown): error is AppAuthError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "message" in error
  );
};

export const getProfileError = (error: unknown) => {
  if (isAppAuthError(error)) {
    return error;
  }

  return createAuthError(
    "profile_request_failed",
    "We could not load your account profile. Please try again.",
    error,
  );
};
