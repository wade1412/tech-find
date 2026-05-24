const skeletonLength = 6;

function UnitSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
      {[...Array(skeletonLength)].map((_, i) => (
        <div
          key={i}
          className="h-20 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800"
        />
      ))}
    </div>
  );
}

export default UnitSkeleton;
