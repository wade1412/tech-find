interface ErrorMessageProps {
  message: string | undefined;
}

function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-400">
      {message || "Something went wrong..."}
    </div>
  );
}

export default ErrorMessage;
