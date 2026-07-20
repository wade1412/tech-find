import { centeredContainerStyle } from "../../../shared/styles/styles";

function ManageTechniciansListSkeleton() {
  return (
    <div className={centeredContainerStyle}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-2">
            <div className="h-6 w-44 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-64 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="h-10 w-full animate-pulse rounded-xl bg-zinc-200 md:w-72 dark:bg-zinc-800" />
        </div>
        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ManageTechniciansListSkeleton;
