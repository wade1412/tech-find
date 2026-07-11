import type { ReactNode } from "react";
import { headingStyleDefault } from "../../../../shared/styles/styles";

interface EditorPanelProps {
  title: string;
  children: ReactNode;
}

function EditorPanel({ title, children }: EditorPanelProps) {
  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-zinc-200 bg-zinc-50/50 py-3 px-4 dark:border-zinc-800 dark:bg-zinc-900/40">
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <h3 className={headingStyleDefault}>{title}</h3>
        </div>

        {children}
      </div>
    </div>
  );
}

export default EditorPanel;
