import ThemeToggle from "../features/theme/ThemeToggle";
import HomePage from "../pages/HomePage";

function App() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 transition-colors dark:bg-zinc-950 dark:text-zinc-50">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-zinc-50/80 backdrop-blur-sm transition-colors dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
          <span className="font-heading text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            TechFind
          </span>
          <ThemeToggle />
        </div>
      </header>

      <HomePage />
    </div>
  );
}

export default App;
