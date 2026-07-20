import { centeredContainerStyle } from "../styles/styles";

function ManagementListSkeleton() {
  return (
    <div
      className={centeredContainerStyle}
      role="status"
      aria-label="Loading management list"
    >
      <div className="flex flex-col gap-4" aria-hidden="true">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <div className="h-6 w-44 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-64 max-w-full animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="h-10 w-full animate-pulse rounded-xl bg-zinc-200 md:w-72 dark:bg-zinc-800" />
        </div>

        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManagementListSkeleton;
