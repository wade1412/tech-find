import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import { Suspense } from "react";
import { InlineSpinner } from "../shared/ui/Spinners";

function AuthenticatedLayout() {
  return (
    <div className="flex min-h-dvh flex-col bg-zinc-50 text-zinc-950 transition-colors dark:bg-zinc-950 dark:text-zinc-50">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<InlineSpinner />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

export default AuthenticatedLayout;
