import { Outlet, useLocation } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import { Suspense } from "react";
import { InlineSpinner } from "../shared/ui/Spinners";
import { MuiThemeProvider } from "../features/theme/MuiThemeProvider";
import { SuccessFeedbackProvider } from "../shared/feedback/SuccessFeedbackProvider";

function AuthenticatedLayout() {
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";

  return (
    <MuiThemeProvider>
      <div
        className={`flex min-h-dvh flex-col bg-zinc-50 text-zinc-950 transition-colors dark:bg-zinc-950 dark:text-zinc-50 ${
          isHomePage ? "md:h-dvh md:overflow-hidden" : ""
        }`}
      >
        <Header />
        <main className="flex min-h-0 flex-1 flex-col">
          <SuccessFeedbackProvider>
            <Suspense fallback={<InlineSpinner />}>
              <Outlet />
            </Suspense>
          </SuccessFeedbackProvider>
        </main>
        <Footer />
      </div>
    </MuiThemeProvider>
  );
}

export default AuthenticatedLayout;
