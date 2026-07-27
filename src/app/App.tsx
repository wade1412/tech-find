import { lazy, Suspense } from "react";
import { Outlet, Route, Routes } from "react-router";
import ProtectedRoute from "../features/auth/ui/ProtectedRoute";
import { FullPageSpinner } from "../shared/ui/Spinners";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout";
import PermissionRoute from "../features/auth/ui/PermissionRoute";
import NotFoundPage from "../pages/NotFoundPage";

//Login and related
const LoginPage = lazy(() => import("../pages/LoginPage"));
const ForgotPasswordPage = lazy(() => import("../pages/ForgotPasswordPage"));
const SecureEmailLinkPage = lazy(() => import("../pages/SecureEmailLinkPage"));
const UpdatePasswordPage = lazy(() => import("../pages/UpdatePasswordPage"));
const EmailConfirmationPage = lazy(
  () => import("../pages/EmailConfirmationPage"),
);

//Home
const HomePage = lazy(() => import("../pages/HomePage"));

//Technicians
const ManageTechniciansPage = lazy(
  () => import("../pages/manageTechnicians/ManageTechniciansPage"),
);
const NewTechnicianPage = lazy(
  () => import("../pages/manageTechnicians/NewTechnicianPage"),
);
const EditTechnicianPage = lazy(
  () => import("../pages/manageTechnicians/EditTechnicianPage"),
);

// Users
const ManageUsersPage = lazy(
  () => import("../pages/manageUsers/ManageUsersPage"),
);
const EditUserPage = lazy(() => import("../pages/manageUsers/EditUserPage"));
const NewUserPage = lazy(() => import("../pages/manageUsers/NewUserPage"));

const ManageServicesPage = lazy(
  () => import("../pages/manageServices/ManageServicesPage"),
);
const EditUnitPage = lazy(() => import("../pages/manageServices/EditUnitPage"));
const NewUnitPage = lazy(() => import("../pages/manageServices/NewUnitPage"));

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
        path="/forgot-password"
        element={
          <Suspense fallback={<FullPageSpinner />}>
            <ForgotPasswordPage />
          </Suspense>
        }
      />
      <Route
        path="/secure-email-link"
        element={
          <Suspense fallback={<FullPageSpinner />}>
            <SecureEmailLinkPage />
          </Suspense>
        }
      />
      <Route
        path="/update-password"
        element={
          <Suspense fallback={<FullPageSpinner />}>
            <UpdatePasswordPage />
          </Suspense>
        }
      />
      <Route
        path="/email-confirmation"
        element={
          <Suspense fallback={<FullPageSpinner />}>
            <EmailConfirmationPage />
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
              <Outlet />
            </PermissionRoute>
          }
        >
          <Route index element={<ManageTechniciansPage />} />
          <Route path=":technicianId/edit" element={<EditTechnicianPage />} />
          <Route path="new" element={<NewTechnicianPage />} />
        </Route>

        <Route
          path="services"
          element={
            <PermissionRoute permission="canManageServices">
              <Outlet />
            </PermissionRoute>
          }
        >
          <Route index element={<ManageServicesPage />} />
          <Route path="units/:unitId/edit" element={<EditUnitPage />} />
          <Route path="units/new" element={<NewUnitPage />} />
        </Route>

        <Route
          path="users"
          element={
            <PermissionRoute permission="canManageUsers">
              <Outlet />
            </PermissionRoute>
          }
        >
          <Route index element={<ManageUsersPage />} />
          <Route path=":userId/edit" element={<EditUserPage />} />
          <Route path="new" element={<NewUserPage />} />
        </Route>
        <Route
          path="owner"
          element={
            <PermissionRoute permission="canUseOwnerTools">
              <OwnerToolsPage />
            </PermissionRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
