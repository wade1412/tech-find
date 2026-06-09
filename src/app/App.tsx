import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import { Route, Routes } from "react-router";
import { useTheme } from "../features/theme/useTheme";
import logoLight from "../shared/assets/techfind-logo-light.svg";
import logoDark from "../shared/assets/techfind-logo-dark.svg";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import ProtectedRoute from "../features/auth/ui/ProtectedRoute";

function AppLayout() {
  const { theme } = useTheme();
  const logoSource = theme === "dark" ? logoDark : logoLight;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-950 transition-colors dark:bg-zinc-950 dark:text-zinc-50">
      <Header logoSource={logoSource} />

      <main className="flex-1">
        <HomePage />
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
