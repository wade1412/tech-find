import HorizontalDivider from "../../../shared/ui/HorizontalDivider";

type ManagementSectionSkeletonVariant =
  | "serviceZones"
  | "skills"
  | "ignoreList";

interface ManagementSectionSkeletonProps {
  variant: ManagementSectionSkeletonVariant;
}

const pulse = "animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-800";

function SkeletonLine({ className = "" }: { className?: string }) {
  return <div className={`${pulse} ${className}`} />;
}

function SkeletonHeader() {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="space-y-2">
        <SkeletonLine className="h-3 w-28" />
        <SkeletonLine className="h-3 w-52 max-w-[55vw]" />
      </div>

      <SkeletonLine className="h-9 w-28 shrink-0 rounded-xl" />
    </div>
  );
}

function SkeletonSubmitArea() {
  return (
    <div className="flex flex-col gap-3 border-t border-zinc-200 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-zinc-800">
      <SkeletonLine className="h-5 w-40" />

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <SkeletonLine className="h-10 w-full rounded-xl sm:w-32" />
        <SkeletonLine className="h-10 w-full rounded-xl sm:w-28" />
      </div>
    </div>
  );
}

function ServiceZonesSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
      <div className="space-y-3">
        <SkeletonLine className="h-14 w-full rounded-xl" />
      </div>

      <div className="h-px w-full bg-zinc-200 lg:h-auto lg:w-px lg:self-stretch dark:bg-zinc-800" />

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <SkeletonLine className="h-8 w-28" />
          <SkeletonLine className="h-8 w-24" />
        </div>
      </div>
    </div>
  );
}

function SkillsSkeleton() {
  return (
    <div className="columns-1 gap-3 md:columns-2">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="mb-3 break-inside-avoid rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/60"
        >
          <div className="border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
            <SkeletonLine className="h-4 w-28" />
          </div>

          <div className="space-y-2 p-2">
            <SkeletonLine className="h-9 w-full" />
            {index !== 1 && <SkeletonLine className="h-9 w-4/5" />}
          </div>
        </div>
      ))}
    </div>
  );
}

function IgnoreListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
      {[0, 1].map((index) => (
        <div
          key={index}
          className="flex min-h-20 flex-col gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-3 dark:border-zinc-800 dark:bg-zinc-900/60 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0 flex-1 space-y-2">
            <SkeletonLine className="h-3 w-24" />
            <div className="flex flex-wrap gap-1.5">
              <SkeletonLine className="h-7 w-24" />
              {index === 0 && <SkeletonLine className="h-7 w-28" />}
            </div>
          </div>

          <div className="flex shrink-0 justify-end gap-1">
            <SkeletonLine className="h-8 w-14" />
            <SkeletonLine className="h-8 w-8" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ManagementSectionSkeleton({
  variant,
}: ManagementSectionSkeletonProps) {
  const content = {
    serviceZones: <ServiceZonesSkeleton />,
    skills: <SkillsSkeleton />,
    ignoreList: <IgnoreListSkeleton />,
  }[variant];

  return (
    <div
      className="flex flex-col gap-6 p-2"
      aria-busy="true"
      aria-label="Loading section"
    >
      <SkeletonHeader />

      <HorizontalDivider />

      {content}

      <SkeletonSubmitArea />
    </div>
  );
}

export default ManagementSectionSkeleton;
