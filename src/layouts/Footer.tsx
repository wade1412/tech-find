function Footer() {
  return (
    <footer
      data-app-footer
      className="border-t border-zinc-200/80 dark:border-zinc-800"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-1.5 px-4 py-3 text-[11px] leading-5 text-zinc-400 sm:flex-row sm:items-center sm:justify-between md:px-6">
        <p>
          TechFind © 2026 · Project by{" "}
          <span className="font-medium text-zinc-500 dark:text-zinc-400">
            Valeriy Petrenko
          </span>
        </p>

        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <a
            href="https://t.me/petrenkov"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-main-500 dark:hover:text-main-400"
          >
            @petrenkov
          </a>
          <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-700">
            /
          </span>
          <a
            href="mailto:fourcer00@gmail.com"
            className="transition-colors hover:text-main-500 dark:hover:text-main-400"
          >
            fourcher00@gmail.com
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
