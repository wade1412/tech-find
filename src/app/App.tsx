import { lazy, Suspense } from "react";
import { Outlet, Route, Routes } from "react-router";
import ProtectedRoute from "../features/auth/ui/ProtectedRoute";
import { FullPageSpinner } from "../shared/ui/Spinners";
import AuthenticatedLayout from "../layouts/AuthenticatedLayout";
import PermissionRoute from "../features/auth/ui/PermissionRoute";
import NotFoundPage from "../pages/NotFoundPage";

//----- Login Page and related -----
const LoginPage = lazy(() => import("../pages/LoginPage"));
const ForgotPasswordPage = lazy(() => import("../pages/ForgotPasswordPage"));
const SecureEmailLinkPage = lazy(() => import("../pages/SecureEmailLinkPage"));
const UpdatePasswordPage = lazy(() => import("../pages/UpdatePasswordPage"));
const EmailConfirmationPage = lazy(
  () => import("../pages/EmailConfirmationPage"),
);

// ----- Home Page -----
const HomePage = lazy(() => import("../pages/HomePage"));

// ----- Manage Technicians -----
const ManageTechniciansPage = lazy(
  () => import("../pages/manageTechnicians/ManageTechniciansPage"),
);
const NewTechnicianPage = lazy(
  () => import("../pages/manageTechnicians/NewTechnicianPage"),
);
const EditTechnicianPage = lazy(
  () => import("../pages/manageTechnicians/EditTechnicianPage"),
);

// ----- Manage Users -----
const ManageUsersPage = lazy(
  () => import("../pages/manageUsers/ManageUsersPage"),
);
const EditUserPage = lazy(() => import("../pages/manageUsers/EditUserPage"));
const NewUserPage = lazy(() => import("../pages/manageUsers/NewUserPage"));

// ----- Manage Services -----
const ManageServicesPage = lazy(
  () => import("../pages/manageServices/ManageServicesPage"),
);
// Manage Units
const EditUnitPage = lazy(() => import("../pages/manageServices/EditUnitPage"));
const NewUnitPage = lazy(() => import("../pages/manageServices/NewUnitPage"));
// Manage Brands and Brand Groups
const EditBrandPage = lazy(
  () => import("../pages/manageServices/EditBrandPage"),
);
const NewBrandPage = lazy(() => import("../pages/manageServices/NewBrandPage"));
const EditBrandGroupPage = lazy(
  () => import("../pages/manageServices/EditBrandGroupPage"),
);
const NewBrandGroupPage = lazy(
  () => import("../pages/manageServices/NewBrandGroupPage"),
);
// Manage Specific Issues
const EditSpecificIssuePage = lazy(
  () => import("../pages/manageServices/EditSpecificIssuePage"),
);
const NewSpecificIssuePage = lazy(
  () => import("../pages/manageServices/NewSpecificIssuePage"),
);
// Manage Service Zones
const EditZonePage = lazy(() => import("../pages/manageServices/EditZonePage"));
const NewZonePage = lazy(() => import("../pages/manageServices/NewZonePage"));

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

          <Route path="brands/:brandId/edit" element={<EditBrandPage />} />
          <Route path="brands/new" element={<NewBrandPage />} />
          <Route
            path="brand-groups/:brandGroupId/edit"
            element={<EditBrandGroupPage />}
          />
          <Route path="brand-groups/new" element={<NewBrandGroupPage />} />
          <Route
            path="specific-issues/:specificIssueId/edit"
            element={<EditSpecificIssuePage />}
          />
          <Route
            path="specific-issues/new"
            element={<NewSpecificIssuePage />}
          />
          <Route path="zones/:zoneId/edit" element={<EditZonePage />} />
          <Route path="zones/new" element={<NewZonePage />} />
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
