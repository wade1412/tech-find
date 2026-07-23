import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  closeLocalAuthSession,
  verifyImplicitEmailLink,
  verifySecureEmailLink,
} from "../features/auth/model/auth.email-links.api";
import {
  markPasswordRecoverySession,
  parseImplicitEmailLink,
  parseSecureEmailLink,
} from "../features/auth/model/auth.recovery";
import AuthPageShell, {
  authErrorStyle,
} from "../features/auth/ui/AuthPageShell";
import { primaryButton } from "../shared/styles/styles";

function SecureEmailLinkPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const link = useMemo(
    () => parseSecureEmailLink(location.search),
    [location.search],
  );
  const implicitLink = useMemo(
    () => parseImplicitEmailLink(location.hash),
    [location.hash],
  );
  const [verificationError, setVerificationError] = useState("");
  const error =
    link.success || implicitLink ? verificationError : link.error;
  const linkType = link.success ? link.params.type : implicitLink?.type;
  const isRecoveryLink = linkType === "recovery";
  const isPasswordSetupLink =
    linkType === "recovery" || linkType === "invite";

  useEffect(() => {
    let isActive = true;

    if (!link.success && !implicitLink) {
      return () => {
        isActive = false;
      };
    }

    const verifyLink = async () => {
      try {
        const type = link.success ? link.params.type : implicitLink!.type;
        const session = link.success
          ? await verifySecureEmailLink(link.params)
          : await verifyImplicitEmailLink(implicitLink!);
        if (!isActive) return;

        if (type === "recovery" || type === "invite") {
          if (!session) {
            throw new Error("The recovery session could not be created.");
          }

          markPasswordRecoverySession(session.user.id);
          navigate("/update-password", { replace: true });
          return;
        }

        try {
          await closeLocalAuthSession();
        } catch (signOutError) {
          console.error("Failed to close confirmation session:", signOutError);
        }

        if (isActive) {
          navigate("/email-confirmation?status=confirmed", { replace: true });
        }
      } catch (verificationError) {
        if (!isActive) return;

        setVerificationError(
          verificationError instanceof Error
            ? verificationError.message
            : "This email link is invalid or has expired.",
        );
      }
    };

    void verifyLink();

    return () => {
      isActive = false;
    };
  }, [implicitLink, link, navigate]);

  return (
    <AuthPageShell
      title={
        error
          ? "Email link unavailable"
          : isPasswordSetupLink
            ? "Preparing password setup"
            : "Verifying email link"
      }
      description={
        error
          ? "The link may have expired or already been used."
          : "Please wait while we securely verify your request."
      }
    >
      {error ? (
        <div className="flex flex-col gap-4">
          <p role="alert" className={authErrorStyle}>
            {error}
          </p>
          {isRecoveryLink && (
            <Link to="/forgot-password" className={primaryButton}>
              Request a new reset link
            </Link>
          )}
          <Link
            to="/login"
            className="text-center text-xs font-semibold text-zinc-500 transition-colors hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Back to sign in
          </Link>
        </div>
      ) : (
        <div role="status" className="flex items-center gap-3 text-sm text-zinc-500 dark:text-zinc-400">
          <span
            aria-hidden="true"
            className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-main-500 dark:border-zinc-700 dark:border-t-main-500"
          />
          Verifying secure link...
        </div>
      )}
    </AuthPageShell>
  );
}

export default SecureEmailLinkPage;
