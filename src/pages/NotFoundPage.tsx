import { Link } from "react-router";
import { fallbackMessageBoxStyle } from "../shared/styles/styles";

function NotFoundPage() {
  return (
    <div className="flex min-h-[60dvh] items-center justify-center px-4">
      <section className={fallbackMessageBoxStyle}>
        <div>
          <h1 className="text-lg font-semibold font-heading">Page Not Found</h1>
          <p className="text-xs mt-1 text-zinc-400 dark:text-zinc-500">
            The page you are looking for does not exist
          </p>
        </div>
        <Link
          className="bg-main-500 hover:bg-main-400 focus-visible:ring-main-500  cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-950 transition-[background-color,transform] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98]"
          to="/"
        >
          Back to dashboard
        </Link>
      </section>
    </div>
  );
}

export default NotFoundPage;
