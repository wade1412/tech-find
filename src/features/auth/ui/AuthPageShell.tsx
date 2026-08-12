import type { ReactNode } from "react";
import AuthHeader from "../../../layouts/AuthHeader";
import {
  loginContainerStyle,
  loginFormStyle,
} from "../../../shared/styles/styles";

type AuthPageShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

function AuthPageShell({ title, description, children }: AuthPageShellProps) {
  return (
    <div className={loginContainerStyle}>
      <AuthHeader />

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <section className={loginFormStyle}>
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
