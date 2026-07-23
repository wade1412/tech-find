export const PASSWORD_MIN_LENGTH = 8;

const RECOVERY_USER_STORAGE_KEY = "techfind.recovery-user-id";

export type SecureEmailLinkType = "recovery" | "invite" | "email" | "signup";

export type SecureEmailLinkParams = {
  tokenHash: string;
  type: SecureEmailLinkType;
};

export type ImplicitEmailLinkParams = {
  accessToken: string;
  refreshToken: string;
  type: SecureEmailLinkType;
};

export type SecureEmailLinkParseResult =
  | { success: true; params: SecureEmailLinkParams }
  | { success: false; error: string };

const supportedEmailLinkTypes = new Set<SecureEmailLinkType>([
  "recovery",
  "invite",
  "email",
  "signup",
]);

let recoveryUserIdInMemory: string | null = null;

export const parseSecureEmailLink = (
  search: string,
): SecureEmailLinkParseResult => {
  const searchParams = new URLSearchParams(search);
  const tokenHash = searchParams.get("token_hash")?.trim() ?? "";
  const type = searchParams.get("type")?.trim() ?? "";

  if (!tokenHash) {
    return {
      success: false,
      error: "This email link is incomplete or invalid.",
    };
  }

  if (!supportedEmailLinkTypes.has(type as SecureEmailLinkType)) {
    return {
      success: false,
      error: "This email link type is not supported.",
    };
  }

  return {
    success: true,
    params: { tokenHash, type: type as SecureEmailLinkType },
  };
};

export const parseImplicitEmailLink = (
  hash: string,
): ImplicitEmailLinkParams | null => {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const accessToken = params.get("access_token");
  const refreshToken = params.get("refresh_token");
  const type = params.get("type");

  if (
    !accessToken ||
    !refreshToken ||
    !type ||
    !supportedEmailLinkTypes.has(type as SecureEmailLinkType)
  ) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
    type: type as SecureEmailLinkType,
  };
};

export const getSecureEmailLinkRedirectUrl = () =>
  new URL("/secure-email-link", window.location.origin).toString();

export const markPasswordRecoverySession = (userId: string) => {
  recoveryUserIdInMemory = userId;

  try {
    window.sessionStorage.setItem(RECOVERY_USER_STORAGE_KEY, userId);
  } catch {
    // The in-memory fallback keeps the flow working when storage is blocked.
  }
};

export const hasPasswordRecoverySession = (userId: string) => {
  if (recoveryUserIdInMemory === userId) return true;

  try {
    return window.sessionStorage.getItem(RECOVERY_USER_STORAGE_KEY) === userId;
  } catch {
    return false;
  }
};

export const clearPasswordRecoverySession = () => {
  recoveryUserIdInMemory = null;

  try {
    window.sessionStorage.removeItem(RECOVERY_USER_STORAGE_KEY);
  } catch {
    // There may be no available storage to clear.
  }
};

export const validateNewPassword = (
  password: string,
  confirmation: string,
) => {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Password must contain at least ${PASSWORD_MIN_LENGTH} characters.`;
  }

  if (password !== confirmation) {
    return "Passwords do not match.";
  }

  return null;
};
