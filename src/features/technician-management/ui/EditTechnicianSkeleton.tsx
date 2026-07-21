import { centeredContainerStyle } from "../../../shared/styles/styles";

function EditTechnicianSkeleton() {
  return (
    <div className={centeredContainerStyle}>
      <section className="flex flex-col gap-4 p-4 md:p-6">
        <div className="h-7 w-32 animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800" />
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-20 animate-pulse rounded-xl bg-zinc-200 dark:bg-zinc-800"
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default EditTechnicianSkeleton;
