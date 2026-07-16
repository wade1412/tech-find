import { Link, Navigate, useLocation } from "react-router";
import { useAuth } from "../features/auth/model/AuthContext";
import AuthHeader from "../layouts/AuthHeader";
import { useState } from "react";
import { FullPageSpinner } from "../shared/ui/Spinners";
import { isAppAuthError } from "../features/auth/model/auth.errors";
import { primaryButton } from "../shared/styles/styles";
import { AnimatePresence, motion } from "motion/react";
import { hasPasswordRecoverySession } from "../features/auth/model/auth.recovery";

const labelStyle =
  "flex flex-col text-sm font-medium text-zinc-700 dark:text-zinc-300 gap-1.5";

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
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <AuthHeader />

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-lg shadow-zinc-200/30 dark:border-zinc-800 dark:bg-zinc-900/50 dark:shadow-none flex flex-col gap-6"
        >
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
          <label className={labelStyle}>
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitDisabled}
              placeholder="mail@example.com"
              type="email"
              autoComplete="email"
              required
              className="focus:border-main-500 focus:ring-main-500/20 dark:focus:border-main-500 rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-zinc-900 transition-[border-color,background-color,box-shadow] outline-none focus:bg-white focus:ring-2 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:bg-zinc-950"
            />
          </label>

          <label className={labelStyle}>
            Password
            <AnimatePresence initial={false}>
              {password.length > 0 && password.length < 6 && (
                <motion.div
                  key="password-warning"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <p
                    id="password-help"
                    aria-live="polite"
                    className="text-xs font-normal text-zinc-400 dark:text-zinc-500"
                  >
                    Must have at least 6 characters
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            <input
              value={password}
              minLength={6}
              disabled={isSubmitDisabled}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              aria-describedby="password-help"
              autoComplete="current-password"
              required
              className="focus:border-main-500 focus:ring-main-500/20 dark:focus:border-main-500 mt-1.5 rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-zinc-900 transition-[border-color,background-color,box-shadow] outline-none focus:bg-white focus:ring-2 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:bg-zinc-950"
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
                <p
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50/50 px-3.5 py-2 text-xs font-medium text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
                >
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
