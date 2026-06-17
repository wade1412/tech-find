import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router";
import ProtectedRoute from "../features/auth/ui/ProtectedRoute";
import { FullPageSpinner } from "../shared/ui/Spinners";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout";
import PermissionRoute from "../features/auth/ui/PermissionRoute";
import NotFoundPage from "../pages/NotFoundPage";

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
        <Route
          path="technicians"
          element={
            <PermissionRoute permission="canManageTechnicians">
              <ManageTechniciansPage />
            </PermissionRoute>
          }
        />
        <Route
          path="services"
          element={
            <PermissionRoute permission="canManageServices">
              <ManageServicesPage />
            </PermissionRoute>
          }
        />
        <Route
          path="users"
          element={
            <PermissionRoute permission="canManageUsers">
              <ManageUsersPage />
            </PermissionRoute>
          }
        />
        <Route
          path="owner"
          element={
            <PermissionRoute permission="canUseOwnerTools">
              <OwnerToolsPage />
            </PermissionRoute>
          }
        />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
