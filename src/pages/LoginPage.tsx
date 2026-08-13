import { Link, Navigate, useLocation } from "react-router";
import { useAuth } from "../features/auth/model/AuthContext";
import AuthHeader from "../layouts/AuthHeader";
import { useState } from "react";
import { FullPageSpinner } from "../shared/ui/Spinners";
import { isAppAuthError } from "../features/auth/model/auth.errors";
import {
  formInputStyle,
  authContainerStyle,
  authErrorStyle,
  authFormStyle,
  authLabelStyle,
  primaryButton,
} from "../shared/styles/styles";
import { AnimatePresence, motion } from "motion/react";
import { hasPasswordRecoverySession } from "../features/auth/model/auth.recovery";

function LoginPage() {
  const {
    signIn,
    clearAuthError,
    isAuthenticated,
    isLoading,
    isProfileLoading,
    session,
  } = useAuth();

  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const previousLocation = location.state?.from;

  const from = previousLocation
    ? `${previousLocation.pathname}${previousLocation.search}${previousLocation.hash}`
    : "/";

  const isAuthPending = isSubmitting || isProfileLoading;
  const isSubmitDisabled =
    isSubmitting || isLoading || isProfileLoading || isAuthenticated;
  const isPasswordRecovery = Boolean(
    session && hasPasswordRecoverySession(session.user.id),
  );

  if (!isLoading && isPasswordRecovery) {
    return <Navigate to="/update-password" replace />;
  }

  if (!isLoading && !isProfileLoading && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (isSubmitDisabled) return;

    setFormError("");
    clearAuthError();
    setIsSubmitting(true);

    try {
      await signIn(email, password);
    } catch (error) {
      if (isAppAuthError(error)) {
        setFormError(error.message);
      } else if (error instanceof Error) {
        setFormError(error.message);
      } else {
        setFormError("Unable to sign in");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <FullPageSpinner />;
  }

  return (
    <div className={authContainerStyle}>
      <AuthHeader />

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <form onSubmit={handleSubmit} className={authFormStyle}>
          {/* Header */}
          <div className="space-y-1">
            <h1 className="font-heading text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Sign In
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Enter your credentials to continue
            </p>
          </div>

          {/* Inputs */}
          <label className={authLabelStyle}>
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitDisabled}
              placeholder="mail@example.com"
              type="email"
              autoComplete="email"
              required
              className={formInputStyle}
            />
          </label>

          <label className={authLabelStyle}>
            Password
            <input
              value={password}
              disabled={isSubmitDisabled}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              required
              className={formInputStyle}
            />
          </label>

          <Link
            to="/forgot-password"
            className="-mt-3 text-right text-xs font-semibold text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Forgot password?
          </Link>

          <AnimatePresence initial={false}>
            {formError && (
              <motion.div
                key="password-warning"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                style={{ overflow: "hidden" }}
              >
                <p role="alert" className={authErrorStyle}>
                  {formError}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className={primaryButton}
          >
            {isAuthPending ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </main>
    </div>
  );
}

export default LoginPage;
