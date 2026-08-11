import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { appRoutes } from "./app/App.tsx";
import { QueryProvider } from "./app/providers/QueryProvider.tsx";
import { ThemeProvider } from "./features/theme/ThemeProvider.tsx";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import { AuthProvider } from "./features/auth/model/AuthProvider.tsx";

const router = createBrowserRouter([
  {
    children: appRoutes,
    element: (
      <QueryProvider>
        <ThemeProvider>
          <AuthProvider>
            <Outlet />
          </AuthProvider>
        </ThemeProvider>
      </QueryProvider>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
