import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router";
import {
  closeLocalAuthSession,
  getCurrentAuthSession,
  updateRecoveryPassword,
} from "../features/auth/model/auth.email-links.api";
import {
  clearPasswordRecoverySession,
  hasPasswordRecoverySession,
} from "../features/auth/model/auth.recovery";
import AuthPageShell, {
  authErrorStyle,
  authInputStyle,
  authLabelStyle,
} from "../features/auth/ui/AuthPageShell";
import { primaryButton } from "../shared/styles/styles";
import {
  getPasswordRequirements,
  PASSWORD_MIN_LENGTH,
  validateNewPassword,
} from "../features/auth/model/auth.password-policy";

type RecoveryAccess = "checking" | "ready" | "invalid";

function UpdatePasswordPage() {
  const [access, setAccess] = useState<RecoveryAccess>("checking");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let isActive = true;

    const validateRecoveryAccess = async () => {
      try {
        const session = await getCurrentAuthSession();
        const hasAccess = Boolean(
          session && hasPasswordRecoverySession(session.user.id),
        );

        if (isActive) {
          setAccess(hasAccess ? "ready" : "invalid");
        }
      } catch {
        if (isActive) setAccess("invalid");
      }
    };

    void validateRecoveryAccess();

    return () => {
      isActive = false;
    };
  }, []);

  const passwordRequirements = getPasswordRequirements(password);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || access !== "ready") return;

    const validationError = validateNewPassword(password, confirmation);

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await updateRecoveryPassword(password);
      clearPasswordRecoverySession();

      try {
        await closeLocalAuthSession();
      } catch (signOutError) {
        console.error("Failed to close recovery session:", signOutError);
      }

      setIsComplete(true);
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "We could not update your password. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (access === "checking") {
    return (
      <AuthPageShell
        title="Checking recovery session"
        description="Please wait while we validate your password reset request."
      >
        <div
          role="status"
          className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400"
        >
          <span
            aria-hidden="true"
            className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-main-500 dark:border-zinc-700 dark:border-t-main-500"
          />
          Validating session...
        </div>
      </AuthPageShell>
    );
  }

  if (access === "invalid") {
    return (
      <AuthPageShell
        title="Recovery session unavailable"
        description="Open the latest reset link from your email and try again."
      >
        <Link to="/forgot-password" className={primaryButton}>
          Request a new reset link
        </Link>
        <Link
          to="/login"
          className="text-center text-xs font-semibold text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          Back to sign in
        </Link>
      </AuthPageShell>
    );
  }

  if (isComplete) {
    return (
      <AuthPageShell
        title="Password updated"
        description="Your password has been changed successfully."
      >
        <p
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50/60 px-3.5 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300"
        >
          Sign in with your new password to continue.
        </p>
        <Link to="/login" className={primaryButton}>
          Sign in
        </Link>
      </AuthPageShell>
    );
  }

  return (
    <AuthPageShell
      title="Create a new password"
      description={`Follow the password requirements`}
    >
      <div className="flex flex-col gap-2">
        {passwordRequirements.map((req) => (
          <div
            key={req.id}
            className="flex gap-2 items-center text-sm text-zinc-500 dark:text-zinc-400"
          >
            {req.isMet ? (
              <svg
                width="8"
                height="8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-emerald-500"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg
                width="8"
                height="8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-zinc-400"
              >
                <circle cx="12" cy="12" r="9" />
              </svg>
            )}
            <p>{req.label}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <label className={authLabelStyle}>
          New password
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isSubmitting}
            type="password"
            autoComplete="new-password"
            minLength={PASSWORD_MIN_LENGTH}
            required
            className={authInputStyle}
          />
        </label>

        <label className={authLabelStyle}>
          Confirm new password
          <input
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            disabled={isSubmitting}
            type="password"
            autoComplete="new-password"
            minLength={PASSWORD_MIN_LENGTH}
            required
            className={authInputStyle}
          />
        </label>

        {error && (
          <p role="alert" className={authErrorStyle}>
            {error}
          </p>
        )}

        <button type="submit" disabled={isSubmitting} className={primaryButton}>
          {isSubmitting ? "Updating..." : "Update password"}
        </button>
      </form>
    </AuthPageShell>
  );
}

export default UpdatePasswordPage;
