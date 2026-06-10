import { Navigate, useLocation, useNavigate } from "react-router";
import { useAuth } from "../features/auth/model/AuthContext";
import { useState } from "react";
import AuthHeader from "../layouts/AuthHeader";

function LoginPage() {
  const { signIn, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/";

  if (!isLoading && isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setFormError("");
    setIsSubmitting(true);

    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch {
      setFormError("Invalid email or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <AuthHeader />

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xl shadow-zinc-200/30 dark:border-zinc-800 dark:bg-zinc-900/50 dark:shadow-none"
        >
          {/* Header */}
          <div className="mb-6 space-y-1">
            <h1 className="font-heading text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              TechFind
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Sign in to continue to your account
            </p>
          </div>

          {/* Inputs */}
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Email
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="mail@example.com"
                type="email"
                autoComplete="email"
                required
                className="focus:border-main-500 focus:ring-main-500/20 dark:focus:border-main-500 rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-zinc-900 transition-all outline-none focus:bg-white focus:ring-2 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:bg-zinc-950"
              />
            </label>

            <label className="flex flex-col text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Password
              <div
                className={`overflow-hidden transition-all duration-200 ${password.trim().length < 5 ? "max-h-5" : "max-h-0"}`}
              >
                <p className="text-xs font-normal text-zinc-400 dark:text-zinc-500">
                  Must have at least 6 characters
                </p>
              </div>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                required
                className="focus:border-main-500 focus:ring-main-500/20 dark:focus:border-main-500 mt-1.5 rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-zinc-900 transition-all outline-none focus:bg-white focus:ring-2 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:bg-zinc-950"
              />
            </label>

            {formError && (
              <p className="rounded-xl border border-red-200 bg-red-50/50 px-3.5 py-2 text-xs font-medium text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400">
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-main-500 hover:bg-main-400 focus-visible:ring-main-500 mt-2 cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default LoginPage;
