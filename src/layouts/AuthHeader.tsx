import { Link } from "react-router";
import { useTheme } from "../features/theme/useTheme";
import ThemeToggle from "../features/theme/ThemeToggle";
import logoLight from "../shared/assets/techfind-logo-light.svg";
import logoDark from "../shared/assets/techfind-logo-dark.svg";

function AuthHeader() {
  const { theme } = useTheme();
  const logoSource = theme === "dark" ? logoDark : logoLight;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-zinc-50/80 backdrop-blur-md transition-colors dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/login" className="flex items-center gap-2 group">
          <img
            src={logoSource}
            alt=""
            aria-hidden="true"
            className="h-9 w-9 transition-transform duration-200 group-hover:scale-105"
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
