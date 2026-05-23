import ThemeToggle from "../features/theme/ThemeToggle";
import HomePage from "../pages/HomePage";

function App() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950 transition-colors dark:bg-zinc-900 dark:text-zinc-50">
      <div className="flex w-full text-center items-center px-6 py-2 justify-between">
        <h1>TechFind</h1>

        <ThemeToggle />
      </div>
      <HomePage />
    </main>
  );
}

export default App;
