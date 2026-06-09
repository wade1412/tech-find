import { Link } from "react-router";
import { useTheme } from "../features/theme/useTheme";
import ThemeToggle from "../features/theme/ThemeToggle";
import logoLight from "../shared/assets/techfind-logo-light.svg";
import logoDark from "../shared/assets/techfind-logo-dark.svg";

function AuthHeader() {
  const { theme } = useTheme();
  const logoSource = theme === "dark" ? logoDark : logoLight;

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-200 bg-zinc-50/80 backdrop-blur-sm transition-colors dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link to="/login" className="flex gap-1 items-center">
          <img
            src={logoSource}
            alt=""
            aria-hidden="true"
            className="h-10 w-10"
          />
          <h2 className="font-heading text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            TechFind
          </h2>
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}

export default AuthHeader;
