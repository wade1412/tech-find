import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/App.tsx";
import { QueryProvider } from "./app/providers/QueryProvider.tsx";
import { ThemeProvider } from "./features/theme/ThemeProvider.tsx";
import { BrowserRouter } from "react-router";
import { AuthProvider } from "./features/auth/model/AuthProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <ThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </QueryProvider>
    </BrowserRouter>
  </StrictMode>,
);
