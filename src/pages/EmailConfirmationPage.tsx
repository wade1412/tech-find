import { Link, useSearchParams } from "react-router";
import AuthPageShell from "../features/auth/ui/AuthPageShell";
import { primaryButton } from "../shared/styles/styles";

function EmailConfirmationPage() {
  const [searchParams] = useSearchParams();
  const isConfirmed = searchParams.get("status") === "confirmed";

  return (
    <AuthPageShell
      title={isConfirmed ? "Email confirmed" : "Confirm your email"}
      description={
        isConfirmed
          ? "Your email address was verified successfully."
          : "Open the confirmation link sent to your email address."
      }
    >
      <p
        role="status"
        className="rounded-xl border border-zinc-200 bg-zinc-50/70 px-3.5 py-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-300"
      >
        {isConfirmed
          ? "You can now sign in to TechFind."
          : "If the email does not arrive, check your spam folder or request a new invitation from an administrator."}
      </p>
      <Link to="/login" className={primaryButton}>
        Go to sign in
      </Link>
    </AuthPageShell>
  );
}

export default EmailConfirmationPage;
