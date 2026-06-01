import { Route, Routes } from "react-router";
import logoLight from "../shared/assets/techfind-logo-light.svg";
import logoDark from "../shared/assets/techfind-logo-dark.svg";

import HomePage from "../pages/HomePage";
import { useTheme } from "../features/theme/useTheme";
import Header from "../layouts/Header";

function App() {
  const { theme } = useTheme();
  const logoSource = theme === "dark" ? logoDark : logoLight;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 transition-colors dark:bg-zinc-950 dark:text-zinc-50">
      <Header logoSource={logoSource} />

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
