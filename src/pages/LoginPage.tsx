import { Navigate, useLocation, useNavigate } from "react-router";
import { useAuth } from "../features/auth/model/AuthContext";
import { useState } from "react";

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
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl p-6 border-zinc-200 bg-white shadow-sm  dark:border-zinc-700/60 dark:bg-zinc-800/50"
      >
        {/* Header */}
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-semibold">TechFind</h1>
          <p>Sign in to continue</p>
        </div>
        {/* Inputs */}
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm">
            {" "}
            Email
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="mail@example.com"
              type="email"
              autoComplete="email"
              required
              className="rounded-xl border border-zinc-300 bg-transparent px-3 py-2 outline-none transition-colors focus:border-main-500 dark:border-zinc-700"
            />
          </label>
          <label className="flex flex-col text-sm">
            Password
            <div
              className={`overflow-hidden transition-[height] duration-200 ${password.trim().length === 0 ? "h-0" : "h-5"}`}
            >
              <p
                className={`text-xs font-medium text-zinc-400 dark:text-zinc-500`}
              >
                Must have at least 6 characters
              </p>
            </div>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              required
              className="mt-1.5 rounded-xl border border-zinc-300 bg-transparent px-3 py-2 outline-none transition-colors focus:border-main-500 dark:border-zinc-700"
            />
          </label>
          {formError && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400">
              {formError}
            </p>
          )}{" "}
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-main-500 px-4 py-2 font-semibold text-zinc-950 transition-colors hover:bg-main-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default LoginPage;
