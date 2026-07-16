import { useState, type FormEvent } from "react";
import { Link } from "react-router";
import {
  getSecureEmailLinkRedirectUrl,
} from "../features/auth/model/auth.recovery";
import { requestPasswordReset } from "../features/auth/model/auth.email-links.api";
import AuthPageShell, {
  authErrorStyle,
  authInputStyle,
  authLabelStyle,
} from "../features/auth/ui/AuthPageShell";
import { primaryButton } from "../shared/styles/styles";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    try {
      await requestPasswordReset(
        email.trim(),
        getSecureEmailLinkRedirectUrl(),
      );
      setIsSubmitted(true);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "We could not send the password reset email.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPageShell
      title="Reset password"
      description={
        isSubmitted
          ? "Check your inbox for the next step."
          : "Enter the email address associated with your account."
      }
    >
      {isSubmitted ? (
        <div className="flex flex-col gap-4">
          <p
            role="status"
            className="rounded-xl border border-emerald-200 bg-emerald-50/60 px-3.5 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300"
          >
            If an account exists for <strong>{email.trim()}</strong>, we sent a
            password reset link. It may take a few minutes to arrive.
          </p>
          <Link to="/login" className={primaryButton}>
            Back to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <label className={authLabelStyle}>
            Email
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmitting}
              placeholder="mail@example.com"
              type="email"
              autoComplete="email"
              required
              className={authInputStyle}
            />
          </label>

          {error && (
            <p role="alert" className={authErrorStyle}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={primaryButton}
          >
            {isSubmitting ? "Sending..." : "Send reset link"}
          </button>

          <Link
            to="/login"
            className="text-center text-xs font-semibold text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Back to sign in
          </Link>
        </form>
      )}
    </AuthPageShell>
  );
}

export default ForgotPasswordPage;
