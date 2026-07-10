function EditorError({ error }: { error: string }) {
  return (
    <p
      role="alert"
      className="rounded-lg border border-red-200 bg-red-50/70 px-3 py-2 text-xs font-medium text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400"
    >
      {error}
    </p>
  );
}

export default EditorError;
