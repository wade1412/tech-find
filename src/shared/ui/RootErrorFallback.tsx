import { useEffect, useRef } from "react";
import {
  fallbackMessageBoxStyle,
  formStyle,
  primaryButton,
  secondaryButton,
} from "../styles/styles";

interface RootErrorFallbackProps {
  isChunkError: boolean;
  onRetry: () => void;
  onReload: () => void;
}

function RootErrorFallback({
  isChunkError,
  onReload,
  onRetry,
}: RootErrorFallbackProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <main className="flex min-h-dvh items-center justify-center bg-zinc-50 px-4 py-12 text-zinc-950 transition-colors dark:bg-zinc-950 dark:text-zinc-50">
      <section
        aria-labelledby="root-error-title"
        aria-live="assertive"
        className={fallbackMessageBoxStyle}
        role="alert"
      >
        <div className={formStyle}>
          <h1
            id="root-error-title"
            ref={headingRef}
            tabIndex={-1}
            className="font-heading text-lg font-semibold outline-none"
          >
            {isChunkError
              ? "TechFind was updated while this tab was open"
              : "Something went wrong"}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {isChunkError
              ? "Reload the application to download the latest version."
              : "We couldn't display this page. Your data has not been changed."}
          </p>
        </div>

        <div className="flex w-full flex-col justify-center gap-2 sm:flex-row">
          <button type="button" className={secondaryButton} onClick={onRetry}>
            Try again
          </button>
          <button
            type="button"
            className={isChunkError ? primaryButton : secondaryButton}
            onClick={onReload}
          >
            Reload application
          </button>
        </div>
      </section>
    </main>
  );
}

export default RootErrorFallback;
