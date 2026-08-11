import type { ReactNode } from "react";
import AuthHeader from "../../../layouts/AuthHeader";

type AuthPageShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export const authLabelStyle =
  "flex flex-col gap-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300";

export const authInputStyle =
  "rounded-xl border border-zinc-200 bg-zinc-50/50 px-3.5 py-2 text-zinc-900 outline-none transition-[border-color,background-color,box-shadow] focus:border-main-500 focus:bg-white focus:ring-2 focus:ring-main-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-main-500 dark:focus:bg-zinc-950";

export const authErrorStyle =
  "rounded-xl border border-red-200 bg-red-50/50 px-3.5 py-2 text-xs font-medium text-red-600 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-400";

function AuthPageShell({ title, description, children }: AuthPageShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <AuthHeader />

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <section className="flex w-full max-w-sm flex-col gap-6 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-lg shadow-zinc-200/30 dark:border-zinc-800 dark:bg-zinc-900/50 dark:shadow-none">
          <div className="space-y-1">
            <h1 className="font-heading text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {title}
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {description}
            </p>
          </div>

          {children}
        </section>
      </main>
    </div>
  );
}

export default AuthPageShell;
