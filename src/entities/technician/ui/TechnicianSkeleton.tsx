const skeletonLength = 4;

function TechnicianSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {[...Array(skeletonLength)].map((_, i) => (
        <div
          key={i}
          className="h-18 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800"
        />
      ))}
    </div>
  );
}

export default TechnicianSkeleton;
