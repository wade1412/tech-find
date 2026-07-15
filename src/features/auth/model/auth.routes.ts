const PROFILE_BYPASS_AUTH_PATHS = new Set([
  "/secure-email-link",
  "/update-password",
  "/email-confirmation",
]);

export const shouldBypassProfileResolution = (pathname: string) =>
  PROFILE_BYPASS_AUTH_PATHS.has(pathname);
