import { isAuthWeakPasswordError, type Session } from "@supabase/supabase-js";
import { supabase } from "../../../shared/api/supabase/supabaseClient";
import type {
  ImplicitEmailLinkParams,
  SecureEmailLinkParams,
} from "./auth.recovery";

const verificationRequests = new Map<string, Promise<Session | null>>();

const getPasswordResetErrorMessage = (code?: string) => {
  switch (code) {
    case "email_address_not_authorized":
      return "Password reset email delivery is not configured for this address. Contact an administrator.";

    case "over_email_send_rate_limit":
      return "Too many authentication emails were requested. Please wait and try again later.";

    default:
      return "We could not send the password reset email.";
  }
};

export const requestPasswordReset = async (
  email: string,
  redirectTo: string,
) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    console.error("Password reset request failed:", {
      code: error.code,
      status: error.status,
    });

    throw new Error(getPasswordResetErrorMessage(error.code));
  }
};

export const verifySecureEmailLink = ({
  tokenHash,
  type,
}: SecureEmailLinkParams) => {
  const requestKey = `${type}:${tokenHash}`;
  const existingRequest = verificationRequests.get(requestKey);

  if (existingRequest) return existingRequest;

  const request = supabase.auth
    .verifyOtp({
      token_hash: tokenHash,
      type,
    })
    .then(({ data, error }) => {
      if (error) {
        throw new Error("This email link is invalid or has expired.");
      }

      return data.session;
    });

  verificationRequests.set(requestKey, request);
  return request;
};

export const verifyImplicitEmailLink = async ({
  accessToken,
  refreshToken,
}: ImplicitEmailLinkParams) => {
  const { data, error } = await supabase.auth.setSession({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  if (error || !data.session) {
    throw new Error("This email link is invalid or has expired.");
  }

  return data.session;
};

export const getCurrentAuthSession = async () => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error("We could not validate the recovery session.");
  }

  return data.session;
};

export const updateRecoveryPassword = async (password: string) => {
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    if (isAuthWeakPasswordError(error)) {
      if (error.reasons.includes("length"))
        throw new Error("Password must contain at least 12 characters.");

      if (error.reasons.includes("characters"))
        throw new Error("Include lowercase, uppercase and a number");

      if (error.reasons.includes("pwned"))
        throw new Error(
          "This password has appeared in a known data breach. Choose a different password.",
        );
    } else
      throw new Error("We could not update your password. Please try again.");
  }
};

export const closeLocalAuthSession = async () => {
  const { error } = await supabase.auth.signOut({ scope: "local" });

  if (error) {
    throw new Error("We could not close the temporary auth session.");
  }
};
