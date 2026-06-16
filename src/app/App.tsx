import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import ProtectedRoute from "../features/auth/ui/ProtectedRoute";
import { FullPageSpinner } from "../shared/ui/Spinners";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout";

const HomePage = lazy(() => import("../pages/HomePage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const ManageTechniciansPage = lazy(
  () => import("../pages/ManageTechniciansPage"),
);
const ManageServicesPage = lazy(() => import("../pages/ManageServicesPage"));
const ManageUsersPage = lazy(() => import("../pages/ManageUsersPage"));
const OwnerToolsPage = lazy(() => import("../pages/OwnerToolsPage"));

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
            <AuthenticatedLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="technicians" element={<ManageTechniciansPage />} />
        <Route path="services" element={<ManageServicesPage />} />
        <Route path="users" element={<ManageUsersPage />} />
        <Route path="owner" element={<OwnerToolsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
