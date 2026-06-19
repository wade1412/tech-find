interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div>
      <h1 className="font-heading text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default PageHeader;
