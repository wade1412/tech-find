import { useTheme } from "./useTheme";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      className="rounded-xl border border-zinc-300 bg-main-400 px-3 py-2 text-sm text-zinc-950 transition hover:bg-main-500 focus:outline-none focus:ring focus:ring-main-400 dark:border-zinc-700"
      onClick={toggleTheme}
    >
      {theme === "dark" ? "☀ Light" : "🌙 Dark"}
    </button>
  );
}

export default ThemeToggle;
