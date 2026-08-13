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
import AuthPageShell from "../features/auth/ui/AuthPageShell";
import {
  formInputStyle,
  authErrorStyle,
  authLabelStyle,
  primaryButton,
} from "../shared/styles/styles";
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
      description="Use a strong, unique password for your TechFind account."
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <label className={authLabelStyle}>
          New password
          <input
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError("");
            }}
            disabled={isSubmitting}
            type="password"
            autoComplete="new-password"
            minLength={PASSWORD_MIN_LENGTH}
            aria-describedby="password-requirements"
            required
            className={formInputStyle}
          />
        </label>

        <div
          id="password-requirements"
          className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 px-3.5 py-3 dark:border-zinc-800 dark:bg-zinc-950/40"
        >
          <p className="mb-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Password requirements
          </p>
          <ul className="grid gap-1.5" aria-label="Password requirements">
            {passwordRequirements.map((requirement) => (
              <li
                key={requirement.id}
                className={`flex items-center gap-2 text-xs transition-colors ${
                  requirement.isMet
                    ? "text-emerald-700 dark:text-emerald-400"
                    : "text-zinc-500 dark:text-zinc-400"
                }`}
              >
                {requirement.isMet ? (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="h-4 w-4 shrink-0"
                  >
                    <circle
                      cx="10"
                      cy="10"
                      r="8"
                      fill="currentColor"
                      opacity="0.14"
                    />
                    <path
                      d="m6.75 10.1 2.05 2.05 4.45-4.45"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span
                    aria-hidden="true"
                    className="h-4 w-4 shrink-0 rounded-full border border-current opacity-50"
                  />
                )}
                <span className="sr-only">
                  {requirement.isMet ? "Met: " : "Not met: "}
                </span>
                <span>{requirement.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <label className={authLabelStyle}>
          Confirm new password
          <input
            value={confirmation}
            onChange={(event) => {
              setConfirmation(event.target.value);
              setError("");
            }}
            disabled={isSubmitting}
            type="password"
            autoComplete="new-password"
            minLength={PASSWORD_MIN_LENGTH}
            required
            className={formInputStyle}
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
