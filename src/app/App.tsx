import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import ProtectedRoute from "../features/auth/ui/ProtectedRoute";
import { FullPageSpinner, InlineSpinner } from "../shared/ui/Spinners";
import ManageTechniciansPage from "../pages/ManageTechniciansPage";
import ManageServicesPage from "../pages/ManageServicesPage";
import ManageUsersPage from "../pages/ManageUsersPage";
import OwnerToolsPage from "../pages/OwnerToolsPage";

const HomePage = lazy(() => import("../pages/HomePage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));

function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-950 transition-colors dark:bg-zinc-950 dark:text-zinc-50">
      <Header />

      <main className="flex-1">
        <Suspense fallback={<InlineSpinner />}>
          <HomePage />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Suspense fallback={<FullPageSpinner />}>
            <LoginPage />
          </Suspense>
        }
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      />
      <Route path="/technicians" element={<ManageTechniciansPage />} />
      <Route path="/services" element={<ManageServicesPage />} />
      <Route path="/users" element={<ManageUsersPage />} />
      <Route path="/owner" element={<OwnerToolsPage />} />
    </Routes>
  );
}

export default App;
